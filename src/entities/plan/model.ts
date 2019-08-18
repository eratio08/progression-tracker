import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from "typeorm";
import { User, Training, Exercise } from "../../entities";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Plan {
  @Field(_ => ID, { description: "Id of the Plan." })
  @PrimaryColumn()
  id: string;
  @Field()
  @Column()
  name: string;
  @Field({ nullable: true })
  @Column()
  description?: string;

  @Field(_ => User)
  @ManyToOne(_ => User, user => user.plans)
  user: User | string;
  @Field(_ => Exercise)
  @ManyToMany(_ => Exercise)
  @JoinTable({ name: "exercise_assignment" })
  exercises!: Exercise[] | string[];
  @Field(_ => Training)
  @OneToMany(_ => Training, training => training.plan)
  trainings!: Training[] | string[];

  constructor(id: string, name: string, user: User, description?: string) {
    this.id = id;
    this.name = name;
    this.user = user;
    this.description = description;
  }
}
