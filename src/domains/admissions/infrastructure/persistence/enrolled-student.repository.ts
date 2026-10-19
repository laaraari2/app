import { db } from '../../../../db/store';
import { EnrolledStudent, PaginationAndFilterOptions, PaginatedResult } from '../../domain/entities/admissions-types';

export class EnrolledStudentRepository {
  public async findById(id: string, tenantId: string): Promise<EnrolledStudent | null> {
    const student = db.enrolledStudents.get(id);
    if (!student || student.tenantId !== tenantId) return null;
    return student;
  }

  public async findByEnrollmentNumber(enrollmentNumber: string, tenantId: string): Promise<EnrolledStudent | null> {
    for (const student of db.enrolledStudents.values()) {
      if (
        student.tenantId === tenantId &&
        student.enrollmentNumber.toUpperCase() === enrollmentNumber.toUpperCase() &&
        !student.isDeleted
      ) {
        return student;
      }
    }
    return null;
  }

  public async findByApplicantId(applicantId: string, tenantId: string): Promise<EnrolledStudent | null> {
    for (const student of db.enrolledStudents.values()) {
      if (student.tenantId === tenantId && student.applicantId === applicantId && !student.isDeleted) {
        return student;
      }
    }
    return null;
  }

  public async save(student: EnrolledStudent): Promise<EnrolledStudent> {
    db.enrolledStudents.set(student.id, student);
    return student;
  }

  public async getNextEnrollmentSequence(tenantId: string, academicYearId: string): Promise<number> {
    let count = 0;
    for (const st of db.enrolledStudents.values()) {
      if (st.tenantId === tenantId && st.academicYearId === academicYearId) {
        count++;
      }
    }
    return count + 1;
  }

  public async getPaginated(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<EnrolledStudent>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const search = options.search?.toLowerCase().trim();

    let items = Array.from(db.enrolledStudents.values()).filter(s => s.tenantId === tenantId);

    if (!options.includeDeleted) {
      items = items.filter(s => !s.isDeleted);
    }

    if (options.academicYearId) items = items.filter(s => s.academicYearId === options.academicYearId);
    if (options.targetGradeId) items = items.filter(s => s.gradeLevelId === options.targetGradeId);

    if (search) {
      items = items.filter(
        s =>
          s.firstName.toLowerCase().includes(search) ||
          s.lastName.toLowerCase().includes(search) ||
          s.enrollmentNumber.toLowerCase().includes(search)
      );
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;

    return {
      data: items.slice(startIndex, startIndex + limit),
      total,
      page,
      limit,
      totalPages,
    };
  }
}

export const enrolledStudentRepository = new EnrolledStudentRepository();
