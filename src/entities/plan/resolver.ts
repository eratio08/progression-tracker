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
import { AppContext } from "../../server";
import { random } from "../../services";
import { EntityResolver } from "../entity-resolver";
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

@Resolver()
export class PlanResolver extends EntityResolver<Plan> {
  constructor() {
    super(Plan);
  }

  @Authorized()
  @Query(_ => Plan, { description: "Retrieves a plan by the given id." })
  async plan(@Arg("id") id: string): Promise<Plan> {
    const plan = this.repository.findOneOrFail(id);
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
      order: { id: "ASC" },
      where: [{ userId: authUser!.id }],
      relations: ["exercises", "trainings"]
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
}
