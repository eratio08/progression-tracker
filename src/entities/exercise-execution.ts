import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Training } from "./training";
import { Exercise } from "./exercise";

@Entity()
export class ExerciseExecution {
  @PrimaryColumn()
  public id: string;

  @ManyToOne(_ => Training, training => training.exerciseExecutions)
  public traning: Training;
  @ManyToOne(_ => Exercise)
  public exercise: Exercise;

  constructor(id: string, training: Training, exercise: Exercise) {
    this.id = id;
    this.traning = training;
    this.exercise = exercise;
  }
}
