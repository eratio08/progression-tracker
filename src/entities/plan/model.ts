import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Training, User } from "../../entities";
import { BaseEntityWithId } from "../base-entity-with-id";
import { ExerciseAssignment } from "../exercise-assignment/model";

@ObjectType()
@Entity()
export class Plan extends BaseEntityWithId {
  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column()
  description?: string;

  @Field(_ => User)
  @ManyToOne(_ => User, user => user.plans, { nullable: false })
  user: User | string;

  @Field(_ => [Training])
  @OneToMany(_ => Training, training => training.plan)
  trainings!: Training[] | string[];

  @Field(_ => [ExerciseAssignment])
  @OneToMany(
    _ => ExerciseAssignment,
    exerciseAssignments => exerciseAssignments.plan
  )
  exerciseAssignments!: ExerciseAssignment[] | string[];

  constructor(id: string, name: string, user: User, description?: string) {
    super(id);
    this.name = name;
    this.user = user;
    this.description = description;
  }
}
