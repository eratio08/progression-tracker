import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Plan } from "./plan";
import { ExerciseExecution } from "./exercise-execution";

@Entity()
export class Training {
  @PrimaryColumn()
  public id: string;
  @Column()
  public date: Date;

  @ManyToOne(_ => Plan, plan => plan.trainings)
  public plan: Plan;
  @OneToMany(
    _ => ExerciseExecution,
    exerciseExecution => exerciseExecution.traning
  )
  public exerciseExecutions!: ExerciseExecution[];

  constructor(id: string, date: Date, plan: Plan) {
    this.id = id;
    this.date = date;
    this.plan = plan;
  }
}
