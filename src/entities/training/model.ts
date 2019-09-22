import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { ExerciseExecution, Plan } from "../../entities";

@ObjectType()
@Entity()
export class Training {
  @Field(_ => ID)
  @PrimaryColumn()
  readonly id: string;

  @Field()
  @Column({ default: 0, type: "bigint" })
  date: number;

  @Field()
  @Column()
  nr: number;

  @Field(_ => Plan)
  @ManyToOne(_ => Plan, plan => plan.trainings)
  plan: Plan | string;

  @OneToMany(
    _ => ExerciseExecution,
    exerciseExecution => exerciseExecution.training
  )
  exerciseExecutions!: ExerciseExecution[] | string[];

  /**
   * Creates a new instance.
   *
   * @param id - id of the instance
   * @param date - date as a unix timestamp
   * @param nr - trainings number
   * @param plan - related plan
   */
  constructor(id: string, date: number, nr: number, plan: Plan) {
    this.id = id;
    this.date = date;
    this.nr = nr;
    this.plan = plan;
  }
}
