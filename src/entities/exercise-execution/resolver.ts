import { EntityResolver } from "../entity-resolver";
import { ExerciseExecution } from "./model";
import { Authorized, Query, InputType, Field, Arg } from "type-graphql";
import { getRepository } from "typeorm";
import { Training } from "../training";
import { Exercise } from "../exercise/model";
import { random } from "../../services";

@InputType()
class CreateExerciseExecutionInput {
  @Field()
  traningId!: string;
  @Field()
  exerciseId!: string;
  @Field()
  volumen!: number;
  @Field({ nullable: true })
  comment?: string;
  @Field({ nullable: true })
  oneRepMax?: number;
}

export class ExerciseExecutionResolver extends EntityResolver<
  ExerciseExecution
> {
  constructor() {
    super(ExerciseExecution);
  }

  // create
  @Authorized()
  @Query(_ => ExerciseExecution)
  async createExerciseExecution(@Arg("properties")
  {
    traningId,
    exerciseId,
    volumen,
    oneRepMax,
    comment
  }: CreateExerciseExecutionInput): Promise<ExerciseExecution> {
    const trainingRepository = getRepository(Training);
    const training = await trainingRepository.findOneOrFail(traningId, {
      loadRelationIds: true
    });
    const exerciseRepository = getRepository(Exercise);
    const exercise = await exerciseRepository.findOneOrFail(exerciseId, {
      loadRelationIds: true
    });
    const newExerciseExecution = new ExerciseExecution(
      random.id(),
      volumen,
      training,
      exercise,
      comment,
      oneRepMax
    );
    return await this.repository.save(newExerciseExecution);
  }

  // read

  // update

  // delete
}
