import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Exercise, Set, Training } from "../../entities";

@ObjectType()
@Entity()
export class ExerciseExecution {
  @Field(_ => ID)
  @PrimaryColumn()
  readonly id: string;

  @Field()
  @Column()
  volume: number;

  @Field({ nullable: true })
  @Column()
  comment?: string;

  @Field({ nullable: true })
  @Column()
  oneRepMax?: number;

  @ManyToOne(_ => Training, training => training.exerciseExecutions)
  training: Training;

  @ManyToOne(_ => Exercise)
  exercise: Exercise;

  @OneToMany(_ => Set, set => set.exerciseExecution)
  sets!: Set[];

  constructor(
    id: string,
    volume: number,
    training: Training,
    exercise: Exercise,
    comment?: string,
    oneRepMax?: number
  ) {
    this.id = id;
    this.volume = volume;
    this.training = training;
    this.exercise = exercise;
    this.comment = comment;
    this.oneRepMax = oneRepMax;
  }
}
