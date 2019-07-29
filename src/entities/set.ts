import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { ExerciseExecution } from "./exercise-execution";

@Entity()
export class Set {
  @PrimaryColumn()
  public id: string;
  @Column({ type: "integer" })
  public nr: number;
  @Column()
  public weight: number;
  @Column({ type: "integer" })
  public reps: number;

  @ManyToOne(_ => ExerciseExecution)
  public exerciseExecution: ExerciseExecution;

  constructor(
    id: string,
    nr: number,
    weight: number,
    reps: number,
    exerciseExecution: ExerciseExecution
  ) {
    this.id = id;
    this.nr = nr;
    this.weight = weight;
    this.reps = reps;
    this.exerciseExecution = exerciseExecution;
  }
}
