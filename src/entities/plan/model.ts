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
  @Field(_ => ID)
  @PrimaryColumn()
  public id: string;
  @Field()
  @Column()
  public name: string;
  @Field({ nullable: true })
  @Column()
  public description?: string;

  @Field(_ => User)
  @ManyToOne(_ => User, user => user.plans)
  public user: User;
  @Field(_ => Exercise)
  @ManyToMany(_ => Exercise, exercise => exercise.plan)
  @JoinTable()
  public exercises!: Exercise[];
  @Field(_ => Training)
  @OneToMany(_ => Training, training => training.plan)
  public trainings!: Training[];

  constructor(id: string, name: string, user: User) {
    this.id = id;
    this.name = name;
    this.user = user;
  }
}
