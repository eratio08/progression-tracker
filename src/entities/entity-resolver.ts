import { getRepository, ObjectType, Repository } from "typeorm";

export abstract class EntityResolver<T extends { id: string }> {
  protected repository: Repository<T>;

  constructor(entityType: ObjectType<T>) {
    this.repository = getRepository(entityType);
  }
}
