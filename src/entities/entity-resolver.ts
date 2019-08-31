import { getRepository, ObjectType, Repository } from "typeorm";
import { ArgsType, Int, Field } from "type-graphql";
import { Min, Max } from "class-validator";

export abstract class EntityResolver<T extends { id: string }> {
  protected repository: Repository<T>;

  constructor(entityType: ObjectType<T>) {
    // TODO: EL - user proper DI
    this.repository = getRepository(entityType);
  }
}

@ArgsType()
export class PagingArgs {
  @Min(1)
  @Max(50)
  @Field(_ => Int, { nullable: true, defaultValue: 10 })
  take?: number = 10;

  @Min(0)
  @Field(_ => Int, { nullable: true, defaultValue: 0 })
  skip?: number = 0;
}
