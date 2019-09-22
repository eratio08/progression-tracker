import {
  Arg,
  Args,
  Authorized,
  Field,
  ID,
  InputType,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { Repository } from "typeorm";
import { random } from "../../services";
import { PagingArgs } from "../paging-args";
import { Exercise, ExerciseType } from "./model";

@InputType()
class UpdateExerciseInput implements Partial<Exercise> {
  @Field(_ => ID)
  public id!: string;
  @Field({ nullable: true })
  public name?: string;
  @Field(_ => ExerciseType, { nullable: true })
  public type?: ExerciseType;
}

@Resolver(_ => Exercise)
export class ExerciseResolver {
  constructor(private readonly repository: Repository<Exercise>) {}

  @Authorized()
  @Query(_ => Exercise)
  async exercise(@Arg("id") id: string): Promise<Exercise> {
    return await this.repository.findOneOrFail(id);
  }

  @Authorized()
  @Query(_ => [Exercise])
  async exercises(@Args() { skip, take }: PagingArgs): Promise<Exercise[]> {
    const exercises = await this.repository.find({
      take,
      skip
    });
    return exercises;
  }

  @Authorized()
  @Query(_ => Exercise, { description: "Creates a new exercise." })
  async createExercise(
    @Arg("name") name: string,
    @Arg("type", _ => ExerciseType) type: ExerciseType
  ): Promise<Exercise> {
    return await this.repository.save(new Exercise(random.id(), name, type));
  }

  @Authorized()
  @Mutation(_ => Exercise)
  async updateExercise(
    @Arg("exercise") changes: UpdateExerciseInput
  ): Promise<Exercise> {
    const { id } = changes;
    await this.repository.update({ id }, { ...changes });
    return await this.repository.findOneOrFail(changes.id);
  }

  @Authorized()
  @Mutation(_ => String)
  async deleteExercise(@Arg("id") id: string): Promise<"Deleted"> {
    await this.repository.findOneOrFail(id);
    await this.repository.delete(id);
    return "Deleted";
  }
}
