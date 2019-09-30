import { Field, ID, ObjectType } from "type-graphql";
import { PrimaryColumn } from "typeorm";
import { BaseEntity } from "./base-entity";

@ObjectType()
export class BaseEntityWithId extends BaseEntity {
  @Field(_ => ID)
  @PrimaryColumn()
  readonly id!: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}
