import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
  InputType,
  Field,
  ID,
  FieldResolver,
  Root
} from "type-graphql";
import { getRepository } from "typeorm";
import { AppContext } from "../../server";
import { random } from "../../services";
import { EntityResolver, PagingArgs } from "../entity-resolver";
import { Plan } from "../plan";
import { Training } from "./model";

@InputType()
class UpdateTrainingInput implements Partial<Training> {
  @Field(_ => ID)
  id!: string;
  @Field()
  date?: number;
  @Field()
  nr?: number;
}

@Resolver(_ => Training)
export class TrainingResolver extends EntityResolver<Training> {
  constructor() {
    super(Training);
  }

  // get
  @Authorized()
  @Query(_ => Training)
  async traning(@Arg("id") id: string): Promise<Training> {
    return await this.repository.findOneOrFail(id);
  }

  // getAll
  @Authorized()
  @Query(_ => [Training])
  async trainings(
    @Args() { skip, take }: PagingArgs,
    @Ctx() ctx: AppContext
  ): Promise<Training[]> {
    const { authUser } = ctx.request;
    const trainings = await this.repository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .innerJoin("Training.plan", "Plan")
      .innerJoin("Plan.user", "User")
      .where("User.id = :id", { id: authUser!.id })
      .getMany();
    return trainings;
  }

  // create
  @Authorized()
  @Mutation(_ => Training)
  async createTraining(
    @Arg("planId") planId: string,
    @Arg("date", { nullable: true }) date?: number
  ): Promise<Training> {
    const planRepository = getRepository(Plan);
    const plan = await planRepository.findOneOrFail(planId, {
      loadRelationIds: true
    });
    const num = plan.trainings.length + 1;
    const training = await this.repository.save(
      new Training(random.id(), date ? date : Date.now(), num, plan)
    );
    return training;
  }

  // update
  @Authorized()
  @Mutation(_ => Training)
  async updateTraining({
    id,
    ...changes
  }: UpdateTrainingInput): Promise<Training> {
    await this.repository.update(id, changes);
    return this.repository.findOneOrFail(id);
  }

  // delete
  @Authorized()
  @Mutation(_ => String)
  async deleteTraining(@Arg("id") id: string): Promise<"Deleted"> {
    await this.repository.findOneOrFail(id);
    await this.repository.delete(id);
    return "Deleted";
  }

  @FieldResolver()
  async plan(@Root() { plan }: Training): Promise<Plan> {
    if (typeof plan === "string") {
      const planRepository = getRepository(Plan);
      return planRepository.findOneOrFail(plan);
    }
    return plan;
  }
}
