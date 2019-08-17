import {
  Arg,
  Authorized,
  Query,
  Resolver,
  InputType,
  Field,
  ID,
  Mutation
} from "type-graphql";
import { logger } from "../../services/logger";
import { EntityResolver } from "../entity-resolver";
import { Exercise, ExerciseType } from "./model";
import { random } from "../../services";

@InputType()
class UpdateExerciseInput implements Partial<Exercise> {
  @Field(_ => ID)
  public id!: string;
  @Field({ nullable: true })
  public name?: string;
  @Field(_ => ExerciseType, { nullable: true })
  public type?: ExerciseType;
}

@Resolver()
export class ExerciseRsolver extends EntityResolver<Exercise> {
  constructor() {
    super(Exercise);
  }

  @Authorized()
  @Query(_ => Exercise)
  async exercise(@Arg("id") id: string): Promise<Exercise> {
    return await this.repository.findOneOrFail(id);
  }

  @Authorized()
  @Query(_ => [Exercise])
  async exercises(
    @Arg("take", { nullable: true, defaultValue: 10 }) take: number = 10,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number = 0
  ): Promise<Exercise[]> {
    const exercises = await this.repository.find({
      take,
      skip
    });
    logger.debug(exercises);
    return exercises;
  }

  // create
  @Authorized()
  @Query(_ => Exercise, { description: "Creates a new exercise." })
  async createExercise(
    @Arg("name") name: string,
    @Arg("type", _ => ExerciseType) type: ExerciseType
  ): Promise<Exercise> {
    return await this.repository.save(new Exercise(random.id(), name, type));
  }

  // update
  @Authorized()
  @Mutation(_ => Exercise)
  async updateExercise(
    @Arg("exercise") changes: UpdateExerciseInput
  ): Promise<Exercise> {
    const { id } = changes;
    await this.repository.update({ id }, { ...changes });
    return await this.repository.findOneOrFail(changes.id);
  }

  // delete
  @Authorized()
  @Mutation(_ => String)
  async deleteExercise(@Arg("id") id: string): Promise<"Deleted"> {
    await this.repository.findOneOrFail(id);
    await this.repository.delete(id);
    return "Deleted";
  }
}
