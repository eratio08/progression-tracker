import {
  Arg,
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
import { getRepository, In } from "typeorm";
import { AppContext } from "../../server";
import { random } from "../../services";
import { EntityResolver } from "../entity-resolver";
import { Exercise } from "../exercise";
import { Training } from "../training";
import { User } from "../user";
import { Plan } from "./model";

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
export class PlanResolver extends EntityResolver<Plan> {
  constructor() {
    super(Plan);
  }

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
    @Arg("take", { nullable: true, defaultValue: 10 }) take: number = 10,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number = 0,
    @Ctx() ctx: AppContext
  ): Promise<Plan[]> {
    const { authUser } = ctx.request;
    const plans = await this.repository.find({
      take,
      skip,
      where: { user: authUser!.id },
      loadRelationIds: true,
      relations: ["exercises"]
    });
    return plans;
  }

  @Authorized()
  @Mutation(_ => Plan)
  async createPlan(
    @Arg("properties") properties: CreatePlanInput,
    @Ctx() ctx: AppContext
  ) {
    const { name, description } = properties;
    const { authUser } = ctx.request;
    const newPlan = new Plan(random.id(), name, authUser!, description);
    return await this.repository.save(newPlan);
  }

  @Authorized()
  @Mutation(_ => Plan)
  async updatePlan(@Arg("plan") changes: UpdatePlanInput) {
    const { id } = changes;
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
  async user(@Root() plan: Plan): Promise<User> {
    // TODO: EL - use proper DI
    const userRepository = getRepository(User);
    if (typeof plan.user === "string") {
      return await userRepository.findOneOrFail(plan.user);
    }
    return await userRepository.findOneOrFail(plan.user.id);
  }

  @FieldResolver()
  async exercises(@Root() plan: Plan): Promise<Exercise[]> {
    if (plan.exercises.length > 0) {
      // TODO: EL - solves this DI
      const exerciseRepository = getRepository(Exercise);
      const exercises = await exerciseRepository.find({
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
      // TODO: EL - solves this DI
      const trainingRepository = getRepository(Training);
      const trainings = await trainingRepository.find({
        where: { id: In(plan.trainings as string[]) },
        loadRelationIds: true
      });
      return trainings;
    }
    return [];
  }
}
