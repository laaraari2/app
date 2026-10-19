import { db } from '../../../../db/store';
import { PersonRelationship } from '../../domain/entities/people-types';

export class RelationshipRepository {
  public async create(rel: PersonRelationship): Promise<PersonRelationship> {
    db.personRelationships.set(rel.id, rel);
    return rel;
  }

  public async findById(id: string): Promise<PersonRelationship | null> {
    return db.personRelationships.get(id) || null;
  }

  public async findByGuardianAndStudent(
    guardianId: string,
    studentProfileId: string
  ): Promise<PersonRelationship | null> {
    for (const rel of db.personRelationships.values()) {
      if (rel.guardianId === guardianId && rel.studentProfileId === studentProfileId) {
        return rel;
      }
    }
    return null;
  }

  public async findByStudentId(studentProfileId: string): Promise<PersonRelationship[]> {
    let result: PersonRelationship[] = [];
    for (const rel of db.personRelationships.values()) {
      if (rel.studentProfileId === studentProfileId) {
        result.push(rel);
      }
    }
    return result;
  }

  public async findByGuardianId(guardianId: string): Promise<PersonRelationship[]> {
    let result: PersonRelationship[] = [];
    for (const rel of db.personRelationships.values()) {
      if (rel.guardianId === guardianId) {
        result.push(rel);
      }
    }
    return result;
  }

  public async update(id: string, updates: Partial<PersonRelationship>): Promise<PersonRelationship | null> {
    const existing = db.personRelationships.get(id);
    if (!existing) return null;

    const updated: PersonRelationship = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    db.personRelationships.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    return db.personRelationships.delete(id);
  }
}

export const relationshipRepository = new RelationshipRepository();
