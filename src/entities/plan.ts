import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from "typeorm";
import { Exercise } from "./exercise";
import { User } from "./user";
import { Training } from "./training";

@Entity()
export class Plan {
  @PrimaryColumn()
  public id: string;
  @Column()
  public name: string;
  @Column()
  public description?: string;

  @ManyToOne(_ => User, user => user.plans)
  public user: User;
  @ManyToMany(_ => Exercise, exercise => exercise.plan)
  @JoinTable()
  public exercises!: Exercise[];
  @OneToMany(_ => Training, training => training.plan)
  public trainings!: Training[];

  constructor(id: string, name: string, user: User) {
    this.id = id;
    this.name = name;
    this.user = user;
  }
}
