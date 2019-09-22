import { Arg, Authorized, Field, InputType, Query } from "type-graphql";
import { Repository } from "typeorm";
import { random } from "../../services";
import { Exercise } from "../exercise/model";
import { Training } from "../training";
import { ExerciseExecution } from "./model";

@InputType()
class CreateExerciseExecutionInput {
  @Field()
  trainingId!: string;
  @Field()
  exerciseId!: string;
  @Field()
  volume!: number;
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
    trainingId,
    exerciseId,
    volume,
    oneRepMax,
    comment
  }: CreateExerciseExecutionInput): Promise<ExerciseExecution> {
    const training = await this.trainingRepository.findOneOrFail(trainingId, {
      loadRelationIds: true
    });
    const exercise = await this.exerciseRepository.findOneOrFail(exerciseId, {
      loadRelationIds: true
    });
    const newExerciseExecution = new ExerciseExecution(
      random.id(),
      volume,
      training,
      exercise,
      comment,
      oneRepMax
    );
    return await this.repository.save(newExerciseExecution);
  }

  // read
  // async readExerciseExecution

  // update

  // delete
}
