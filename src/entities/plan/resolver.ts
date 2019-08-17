import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { AppContext } from "../../server";
import { random } from "../../services";
import { Plan } from "./model";
import { logger } from "../../services/logger";

@InputType()
class CreatePlanInput {
  @Field()
  id!: string;
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

@Resolver()
export class PlanResolver {
  private planRepository: Repository<Plan>;

  constructor() {
    this.planRepository = getRepository(Plan);
  }

  @Authorized()
  @Query(_ => Plan)
  async plan(@Arg("id") id: string): Promise<Plan> {
    const plan = this.planRepository.findOneOrFail(id);
    return plan;
  }

  @Authorized()
  @Query(_ => [Plan])
  async plans(
    @Arg("take", { nullable: true, defaultValue: 10 }) take: number = 10,
    @Arg("skip", { nullable: true, defaultValue: 0 }) skip: number = 0,
    @Ctx() ctx: AppContext
  ): Promise<Plan[]> {
    const { authUser } = ctx.request;
    const [plans, count] = await this.planRepository.findAndCount({
      take,
      skip,
      order: { id: "ASC" },
      where: [{ userId: authUser!.id }],
      relations: ["exercises", "tranings"]
    });
    logger.debug("count", count);
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
    return await this.planRepository.save(newPlan);
  }

  @Authorized()
  @Mutation(_ => Plan)
  async updatePlan(@Arg("changes") changes: UpdatePlanInput) {
    const { id, description } = changes;
    const plan = await this.planRepository.findOneOrFail(id);
    if (description) {
      plan.description = description;
    }
    return await this.planRepository.save(plan);
  }

  @Authorized()
  @Mutation(_ => String)
  async deletePlan(@Arg("id") id: string): Promise<String> {
    const removedEntity = await this.planRepository.delete(id);
    if (!removedEntity.affected) {
      throw new Error("Entity not found.");
    }
    return "Deleted";
  }
}
