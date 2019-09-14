import { Arg, Authorized, Field, InputType, Query } from "type-graphql";
import { Repository } from "typeorm";
import { random } from "../../services";
import { Exercise } from "../exercise/model";
import { Training } from "../training";
import { ExerciseExecution } from "./model";

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

export class ExerciseExecutionResolver {
  constructor(
    private readonly repository: Repository<ExerciseExecution>,
    private readonly trainingRepository: Repository<Training>,
    private readonly exerciseRepository: Repository<Exercise>
  ) {}

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
    const training = await this.trainingRepository.findOneOrFail(traningId, {
      loadRelationIds: true
    });
    const exercise = await this.exerciseRepository.findOneOrFail(exerciseId, {
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
