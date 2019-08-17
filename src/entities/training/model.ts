import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Plan, ExerciseExecution } from "../../entities";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Training {
  @Field(_ => ID)
  @PrimaryColumn()
  id: string;
  @Field()
  @Column()
  date: Date;
  @Field()
  @Column()
  nr: number;

  @ManyToOne(_ => Plan, plan => plan.trainings)
  plan: Plan;
  @OneToMany(
    _ => ExerciseExecution,
    exerciseExecution => exerciseExecution.traning
  )
  exerciseExecutions!: ExerciseExecution[];

  constructor(id: string, date: Date, nr: number, plan: Plan) {
    this.id = id;
    this.date = date;
    this.nr = nr;
    this.plan = plan;
  }
}
