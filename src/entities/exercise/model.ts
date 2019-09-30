import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ExerciseAssignment } from "../exercise-assignment/model";

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
  readonly id: string;

  @Field()
  @Column()
  name: string;

  @Field(_ => ExerciseType)
  @Column()
  type: ExerciseType;

  @OneToMany(
    _ => ExerciseAssignment,
    exerciseAssignment => exerciseAssignment.exercise
  )
  exerciseAssignments!: ExerciseAssignment[];

  constructor(id: string, name: string, type: ExerciseType) {
    this.id = id;
    this.name = name;
    this.type = type;
  }
}
