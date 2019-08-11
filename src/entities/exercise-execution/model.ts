import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Exercise, Training, Set } from "../../entities";

@ObjectType()
@Entity()
export class ExerciseExecution {
  @Field(_ => ID)
  @PrimaryColumn()
  public id: string;
  @Field()
  @Column()
  public volumen: number;
  @Field({ nullable: true })
  @Column()
  public description?: number;
  @Field()
  @Column()
  public oneRepMax?: number;

  @ManyToOne(_ => Training, training => training.exerciseExecutions)
  public traning: Training;
  @ManyToOne(_ => Exercise)
  public exercise: Exercise;
  @OneToMany(_ => Set, set => set.exerciseExecution)
  public sets!: Set[];

  constructor(
    id: string,
    volumen: number,
    training: Training,
    exercise: Exercise
  ) {
    this.id = id;
    this.volumen = volumen;
    this.traning = training;
    this.exercise = exercise;
  }
}
