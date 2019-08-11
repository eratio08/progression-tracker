import { Arg, Authorized, Ctx, Query, Resolver } from "type-graphql";
import { getRepository, MoreThan, Repository } from "typeorm";
import { AppContext } from "../../server";
import { Plan } from "./model";

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
    @Arg("first", { nullable: true, defaultValue: 10 }) first: number = 10,
    @Arg("after", { nullable: true, defaultValue: 0 }) after: string = "",
    @Ctx() ctx: AppContext
  ) {
    const { authUser } = ctx.request;
    const [plans, count] = await this.planRepository.findAndCount({
      take: first,
      order: { id: "ASC" },
      where: [{ userId: authUser!.id }, { id: MoreThan(after) }]
    });
    console.log(count);
    return plans;
  }
}
