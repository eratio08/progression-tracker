import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

export enum ExerciseType {
  PUSH = "push",
  PULL = "pull",
  CARDIO = "cardio"
}

registerEnumType(ExerciseType, {
  name: "ExerciseType",
  description: "The type of the exercise."
});

@ObjectType()
@Entity()
export class Exercise {
  @Field(_ => ID)
  @PrimaryColumn()
  id!: string;
  @Field()
  @Column()
  name: string;
  @Field(_ => ExerciseType)
  @Column()
  type: ExerciseType;

  constructor(id: string, name: string, type: ExerciseType) {
    this.id = id;
    this.name = name;
    this.type = type;
  }
}
