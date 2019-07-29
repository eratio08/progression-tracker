import { Entity, PrimaryColumn, Column, ManyToMany } from "typeorm";
import { Plan } from "./plan";

enum ExerciseType {
  PUSH = "push",
  PULL = "pull",
  CARDIO = "cardio"
}

@Entity()
export class Exercise {
  @PrimaryColumn()
  public id!: string;
  @Column()
  public name: string;
  @Column()
  public type: ExerciseType;

  @ManyToMany(_ => Plan, plan => plan.exercises)
  public plan: Plan;

  constructor(id: string, name: string, type: ExerciseType, plan: Plan) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.plan = plan;
  }
}
