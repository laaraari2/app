import { randomUUID } from 'crypto';
import { staffRepository } from '../../infrastructure/persistence/staff.repository';
import { StaffMember } from '../../domain/entities/people-types';
import { CreateStaffMemberDto, UpdateStaffMemberDto, BulkActionDto } from '../../dto/people.dto';
import { createStaffSchema } from '../../validators/people.validator';
import {
  DuplicateEmployeeIdError,
  DuplicateNationalIdError,
  PersonNotFoundError,
} from '../../domain/errors/people-domain.error';
import { peopleActivityService } from './people-activity.service';

export class StaffService {
  private static sequenceCounter = 1;

  private generateEmployeeId(): string {
    const year = new Date().getFullYear();
    const seq = String(StaffService.sequenceCounter++).padStart(5, '0');
    return `EMP-${year}-${seq}`;
  }

  public async createStaff(dto: CreateStaffMemberDto, actor?: { userId: string; userEmail: string }): Promise<StaffMember> {
    const validated = createStaffSchema.parse(dto);

    // Check duplicate national ID
    const existingNational = await staffRepository.findByNationalId(dto.tenantId, dto.nationalId);
    if (existingNational) {
      throw new DuplicateNationalIdError(dto.nationalId, 'Staff Member');
    }

    const employeeId = dto.employeeId || this.generateEmployeeId();

    // Check duplicate employee ID
    const existingEmp = await staffRepository.findByEmployeeId(dto.tenantId, employeeId);
    if (existingEmp) {
      throw new DuplicateEmployeeIdError(employeeId);
    }

    const staff: StaffMember = {
      id: randomUUID(),
      tenantId: dto.tenantId,
      campusId: dto.campusId,
      employeeId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      nationalId: dto.nationalId,
      gender: dto.gender,
      dateOfBirth: new Date(dto.dateOfBirth),
      address: dto.address,
      jobTitle: dto.jobTitle,
      department: dto.department,
      staffRole: dto.staffRole,
      employmentType: dto.employmentType,
      contractType: dto.contractType || 'CDI',
      cnssNumber: dto.cnssNumber,
      hourlyRate: dto.hourlyRate,
      assignedZone: dto.assignedZone,
      busId: dto.busId,
      replacementStaffId: dto.replacementStaffId,
      leaveReason: dto.leaveReason,
      status: dto.status || 'ACTIVE',
      joinDate: new Date(dto.joinDate),
      salary: dto.salary,
      userId: dto.userId,
      emergencyContact: dto.emergencyContact,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await staffRepository.create(staff);

    if (actor) {
      await peopleActivityService.logActivity({
        tenantId: dto.tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'CREATE_STAFF',
        resource: 'STAFF',
        resourceId: created.id,
        details: { employeeId: created.employeeId, name: `${created.firstName} ${created.lastName}`, role: created.staffRole },
      });
    }

    return created;
  }

  public async getStaffById(tenantId: string, id: string): Promise<StaffMember> {
    const staff = await staffRepository.findById(id);
    if (!staff || staff.tenantId !== tenantId) {
      throw new PersonNotFoundError('Staff Member', id);
    }
    return staff;
  }

  public async listStaff(
    tenantId: string,
    filters?: {
      campusId?: string;
      role?: string;
      department?: string;
      status?: string;
      search?: string;
    }
  ): Promise<StaffMember[]> {
    return staffRepository.findAllForTenant(tenantId, filters);
  }

  public async updateStaff(
    tenantId: string,
    id: string,
    dto: UpdateStaffMemberDto,
    actor?: { userId: string; userEmail: string }
  ): Promise<StaffMember> {
    const existing = await this.getStaffById(tenantId, id);

    if (dto.nationalId && dto.nationalId.toLowerCase() !== existing.nationalId.toLowerCase()) {
      const dup = await staffRepository.findByNationalId(tenantId, dto.nationalId);
      if (dup && dup.id !== id) {
        throw new DuplicateNationalIdError(dto.nationalId, 'Staff Member');
      }
    }

    const updated = await staffRepository.update(id, dto);
    if (!updated) {
      throw new PersonNotFoundError('Staff Member', id);
    }

    if (actor) {
      await peopleActivityService.logActivity({
        tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'UPDATE_STAFF',
        resource: 'STAFF',
        resourceId: updated.id,
        details: { updates: dto },
      });
    }

    return updated;
  }

  public async softDeleteStaff(
    tenantId: string,
    id: string,
    actor?: { userId: string; userEmail: string }
  ): Promise<boolean> {
    await this.getStaffById(tenantId, id);
    const success = await staffRepository.softDelete(id);

    if (success && actor) {
      await peopleActivityService.logActivity({
        tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'SOFT_DELETE_STAFF',
        resource: 'STAFF',
        resourceId: id,
      });
    }

    return success;
  }

  public async restoreStaff(
    tenantId: string,
    id: string,
    actor?: { userId: string; userEmail: string }
  ): Promise<boolean> {
    const existing = await staffRepository.findById(id);
    if (!existing || existing.tenantId !== tenantId) {
      throw new PersonNotFoundError('Staff Member', id);
    }

    const success = await staffRepository.restore(id);

    if (success && actor) {
      await peopleActivityService.logActivity({
        tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'RESTORE_STAFF',
        resource: 'STAFF',
        resourceId: id,
      });
    }

    return success;
  }

  public async bulkAction(
    tenantId: string,
    dto: BulkActionDto,
    actor?: { userId: string; userEmail: string }
  ): Promise<{ affected: number }> {
    let affected = 0;
    for (const id of dto.ids) {
      try {
        if (dto.action === 'DELETE') {
          if (await this.softDeleteStaff(tenantId, id, actor)) affected++;
        } else if (dto.action === 'RESTORE') {
          if (await this.restoreStaff(tenantId, id, actor)) affected++;
        } else if (dto.action === 'ACTIVATE') {
          await this.updateStaff(tenantId, id, { status: 'ACTIVE' }, actor);
          affected++;
        } else if (dto.action === 'SUSPEND') {
          await this.updateStaff(tenantId, id, { status: 'SUSPENDED' }, actor);
          affected++;
        }
      } catch {
        // Continue processing batch
      }
    }
    return { affected };
  }

  public async calculatePayrollSummary(tenantId: string) {
    const allStaff = await staffRepository.findAllForTenant(tenantId);
    let totalMonthlySalaries = 0;
    let permanentCount = 0;
    let vacataireCount = 0;
    let cleaningStaffCount = 0;
    let transportStaffCount = 0;
    let adminCount = 0;

    for (const staff of allStaff) {
      if (staff.status !== 'TERMINATED') {
        if (staff.salary) {
          totalMonthlySalaries += staff.salary;
        }
        if (staff.staffRole === 'TEACHER') permanentCount++;
        else if (staff.staffRole === 'TEACHER_VACATAIRE') vacataireCount++;
        else if (staff.staffRole === 'CLEANING_STAFF') cleaningStaffCount++;
        else if (staff.staffRole === 'BUS_DRIVER' || staff.staffRole === 'BUS_ATTENDANT') transportStaffCount++;
        else if (staff.staffRole === 'ADMINISTRATOR' || staff.staffRole === 'ACCOUNTANT' || staff.staffRole === 'SECRETARY') adminCount++;
      }
    }

    // Moroccan CNSS/AMO estimation (approx 21.09% employer, 6.74% employee)
    const estimatedCnssEmployer = Math.round(totalMonthlySalaries * 0.2109);
    const estimatedCnssEmployee = Math.round(totalMonthlySalaries * 0.0674);

    return {
      totalStaff: allStaff.length,
      totalMonthlySalaries,
      estimatedCnssEmployer,
      estimatedCnssEmployee,
      breakdown: {
        permanentCount,
        vacataireCount,
        cleaningStaffCount,
        transportStaffCount,
        adminCount,
      },
    };
  }

  public async getWorkCertificate(tenantId: string, id: string) {
    const staff = await this.getStaffById(tenantId, id);
    return {
      certificateNumber: `AT-${new Date().getFullYear()}-${staff.employeeId.replace('EMP-', '')}`,
      staffName: `${staff.firstName} ${staff.lastName}`,
      nationalId: staff.nationalId,
      cnssNumber: staff.cnssNumber || 'Non renseigné',
      jobTitle: staff.jobTitle,
      department: staff.department,
      contractType: staff.contractType || 'CDI',
      joinDate: staff.joinDate,
      issueDate: new Date(),
    };
  }
}

export const staffService = new StaffService();
