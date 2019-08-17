import { Entity, PrimaryColumn, Column, ManyToMany } from "typeorm";
import { Plan } from "../../entities";
import { ObjectType, Field, ID, registerEnumType } from "type-graphql";

enum ExerciseType {
  PUSH = "push",
  PULL = "pull",
  CARDIO = "cardio"
}

registerEnumType(ExerciseType, {
  name: "ExerciseType"
});

@ObjectType()
@Entity()
export class Exercise {
  @Field(_ => ID)
  @PrimaryColumn()
  id!: string;
  @Field()
  @Column()
  name: string;
  @Field(_ => ExerciseType)
  @Column()
  type: ExerciseType;

  @ManyToMany(_ => Plan, plan => plan.exercises)
  plan: Plan;

  constructor(id: string, name: string, type: ExerciseType, plan: Plan) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.plan = plan;
  }
}
