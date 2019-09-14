import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Exercise, Training, Set } from "../../entities";

@ObjectType()
@Entity()
export class ExerciseExecution {
  @Field(_ => ID)
  @PrimaryColumn()
  id: string;
  @Field()
  @Column()
  volumen: number;
  @Field({ nullable: true })
  @Column()
  comment?: string;
  @Field({ nullable: true })
  @Column()
  oneRepMax?: number;

  @ManyToOne(_ => Training, training => training.exerciseExecutions)
  traning: Training;
  @ManyToOne(_ => Exercise)
  exercise: Exercise;
  @OneToMany(_ => Set, set => set.exerciseExecution)
  sets!: Set[];

  constructor(
    id: string,
    volumen: number,
    training: Training,
    exercise: Exercise,
    comment?: string,
    oneRepMax?: number
  ) {
    this.id = id;
    this.volumen = volumen;
    this.traning = training;
    this.exercise = exercise;
    this.comment = comment;
    this.oneRepMax = oneRepMax;
  }
}
