import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { Plan } from "..";
import { BaseEntityWithId } from "../base-entity-with-id";
import { Exercise } from "../exercise/model";

@ObjectType()
@Entity()
export class ExerciseAssignment extends BaseEntityWithId {
  @Field()
  @Column()
  readonly planId: string;

  @Field()
  @Column()
  readonly exerciseId: string;

  @Field()
  @Column()
  targetVolume: number;

  @Field()
  @Column()
  targetWeight: number;

  @Field()
  @Column()
  targetReps: number;

  @Field({ nullable: true })
  @Column()
  oneRepMax?: number;

  @Field(_ => Plan)
  @ManyToOne(() => Plan, plan => plan.exerciseAssignments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  })
  plan!: Plan;

  @Field(_ => Exercise)
  @ManyToOne(() => Exercise, exercise => exercise.exerciseAssignments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  })
  exercise!: Exercise;

  constructor(
    id: string,
    planId: string,
    exerciseId: string,
    targetVolume: number,
    targetWeight: number,
    targetReps: number,
    oneRepMax: number
  ) {
    super(id);
    this.planId = planId;
    this.exerciseId = exerciseId;
    this.targetVolume = targetVolume;
    this.targetWeight = targetWeight;
    this.targetReps = targetReps;
    this.oneRepMax = oneRepMax;
  }
}
