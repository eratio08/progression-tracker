import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { ExerciseExecution } from "../../entities";
import { ObjectType, Field, ID, Int } from "type-graphql";

@ObjectType()
@Entity()
export class Set {
  @Field(_ => ID)
  @PrimaryColumn()
  readonly id: string;
  @Field()
  @Column({ type: "integer" })
  nr: number;
  @Field()
  @Column()
  weight: number;
  @Field(_ => Int)
  @Column({ type: "integer" })
  reps: number;
  @Field()
  @Column()
  targetVolumen: number;
  @Field()
  @Column()
  targetWeight: number;
  @Field(_ => Int)
  @Column({ type: "integer" })
  targetReps: number;

  @Field(_ => ExerciseExecution)
  @ManyToOne(_ => ExerciseExecution)
  exerciseExecution: ExerciseExecution;

  constructor(
    id: string,
    nr: number,
    weight: number,
    reps: number,
    targetVolumen: number,
    targetWeight: number,
    targetReps: number,
    exerciseExecution: ExerciseExecution
  ) {
    this.id = id;
    this.nr = nr;
    this.weight = weight;
    this.reps = reps;
    this.targetVolumen = targetVolumen;
    this.targetWeight = targetWeight;
    this.targetReps = targetReps;
    this.exerciseExecution = exerciseExecution;
  }
}
