import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { ExerciseExecution } from "../../entities";
import { ObjectType, Field, ID, Int } from "type-graphql";

@ObjectType()
@Entity()
export class Set {
  @Field(_ => ID)
  @PrimaryColumn()
  public id: string;
  @Field()
  @Column({ type: "integer" })
  public nr: number;
  @Field()
  @Column()
  public weight: number;
  @Field(_ => Int)
  @Column({ type: "integer" })
  public reps: number;
  @Field()
  @Column()
  public targetVolumen: number;
  @Field()
  @Column()
  public targetWeight: number;
  @Field(_ => Int)
  @Column({ type: "integer" })
  public targetReps: number;

  @Field(_ => ExerciseExecution)
  @ManyToOne(_ => ExerciseExecution)
  public exerciseExecution: ExerciseExecution;

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
