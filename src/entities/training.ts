import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Plan } from "./plan";
import { ExerciseExecution } from "./exercise-execution";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Training {
  @Field(_ => ID)
  @PrimaryColumn()
  public id: string;
  @Field()
  @Column()
  public date: Date;
  @Field()
  @Column()
  public nr: number;

  @ManyToOne(_ => Plan, plan => plan.trainings)
  public plan: Plan;
  @OneToMany(
    _ => ExerciseExecution,
    exerciseExecution => exerciseExecution.traning
  )
  public exerciseExecutions!: ExerciseExecution[];

  constructor(id: string, date: Date, nr: number, plan: Plan) {
    this.id = id;
    this.date = date;
    this.nr = nr;
    this.plan = plan;
  }
}
