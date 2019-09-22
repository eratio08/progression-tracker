import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql";
import { AppContext } from "../../server";
import { random } from "../../services";
import { Exercise } from "../exercise";
import { PagingArgs } from "../paging-args";
import { Training } from "../training";
import { User } from "../user";
import { Plan } from "./model";
import { In, Repository } from "typeorm";

@InputType()
class CreatePlanInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
class UpdatePlanInput implements Partial<Plan> {
  @Field()
  id!: string;

  @Field({ nullable: true })
  description?: string;
}

@Resolver(_ => Plan)
export class PlanResolver {
  constructor(
    private readonly repository: Repository<Plan>,
    private readonly userRepository: Repository<User>,
    private readonly exerciseRepository: Repository<Exercise>,
    private readonly trainingRepository: Repository<Training>
  ) {}

  @Authorized()
  @Query(_ => Plan, { description: "Retrieves a plan by the given id." })
  async plan(@Arg("id") id: string): Promise<Plan> {
    const plan = await this.repository.findOneOrFail(id, {
      loadRelationIds: true
    });
    return plan;
  }

  @Authorized()
  @Query(_ => [Plan], { description: "Retrieves a page of plans." })
  async plans(
    @Args() { skip, take }: PagingArgs,
    @Ctx() ctx: AppContext
  ): Promise<Plan[]> {
    const { authUser } = ctx.request;
    const plans = await this.repository.find({
      take,
      skip,
      where: { user: authUser!.id },
      loadRelationIds: true
    });
    return plans;
  }

  @Authorized()
  @Mutation(_ => Plan)
  async createPlan(
    @Arg("properties") { name, description }: CreatePlanInput,
    @Ctx() ctx: AppContext
  ) {
    const { authUser } = ctx.request;
    const newPlan = new Plan(random.id(), name, authUser!, description);
    return await this.repository.save(newPlan);
  }

  @Authorized()
  @Mutation(_ => Plan)
  async updatePlan(@Arg("plan") { id, ...changes }: UpdatePlanInput) {
    await this.repository.update({ id }, { ...changes });
    return await this.repository.findOneOrFail(id);
  }

  @Authorized()
  @Mutation(_ => String)
  async deletePlan(@Arg("id") id: string): Promise<"Deleted"> {
    await this.repository.findOneOrFail(id);
    await this.repository.delete(id);
    return "Deleted";
  }

  @FieldResolver()
  async user(@Root() { user }: Plan): Promise<User> {
    if (typeof user === "string") {
      return await this.userRepository.findOneOrFail(user);
    }
    return user;
  }

  @FieldResolver()
  async exercises(@Root() plan: Plan): Promise<Exercise[]> {
    if (plan.exercises.length > 0) {
      const exercises = await this.exerciseRepository.find({
        where: { id: In(plan.exercises as string[]) },
        loadRelationIds: true
      });
      return exercises;
    }
    return [];
  }

  @FieldResolver()
  async trainings(@Root() plan: Plan): Promise<Training[]> {
    if (plan.trainings.length > 0) {
      const trainings = await this.trainingRepository.find({
        where: { id: In(plan.trainings as string[]) },
        loadRelationIds: true
      });
      return trainings;
    }
    return [];
  }

  @Authorized()
  @Mutation(_ => Plan)
  async addExercisesToPlan(
    @Arg("planId") planId: string,
    @Arg("exerciseIds", _ => [String]) exerciseIds: string[]
  ): Promise<Plan> {
    const plan = await this.repository.findOneOrFail(planId, {
      relations: ["exercises"]
    });
    const exercises = await this.exerciseRepository.find({
      where: { id: In(exerciseIds) }
    });
    plan.exercises = [...(plan.exercises as Exercise[]), ...exercises];
    await this.repository.save(plan);
    return await this.repository.findOneOrFail(plan.id, {
      loadRelationIds: true
    });
  }

  @Authorized()
  @Mutation(_ => Plan)
  async removeExercisesFromPlan(
    @Arg("planId") planId: string,
    @Arg("exerciseIds", _ => [String]) exerciseIds: string[]
  ): Promise<Plan> {
    const plan = await this.repository.findOneOrFail(planId, {
      relations: ["exercises"]
    });
    const exercises = await this.exerciseRepository.find({
      where: { id: In(exerciseIds) }
    });
    const filteredExercises = (plan.exercises as Exercise[]).filter(
      (exercise: Exercise) => exercises.indexOf(exercise) !== -1
    );
    plan.exercises = filteredExercises;
    const updatedPlan = await this.repository.save(plan);
    return updatedPlan;
  }
}
