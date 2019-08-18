import { getRepository, ObjectType, Repository } from "typeorm";

export abstract class EntityResolver<T extends { id: string }> {
  protected repository: Repository<T>;

  constructor(entityType: ObjectType<T>) {
    // TODO: EL - user proper DI
    this.repository = getRepository(entityType);
  }
}
