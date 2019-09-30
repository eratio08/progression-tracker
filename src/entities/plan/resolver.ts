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
import { In, Repository } from "typeorm";
import { AppContext } from "../../server";
import { random } from "../../services";
import { Exercise } from "../exercise";
import { ExerciseAssignment } from "../exercise-assignment/model";
import { PagingArgs } from "../paging-args";
import { Training } from "../training";
import { User } from "../user";
import { Plan } from "./model";

@InputType()
class AddPlanInput {
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

@InputType()
class AddExerciseInput {
  @Field()
  id!: string;
  @Field({ nullable: true })
  targetVolume: number = 0;
  @Field({ nullable: true })
  targetWeight: number = 0;
  @Field({ nullable: true })
  targetReps: number = 0;
  @Field({ nullable: true })
  oneRepMax: number = 0;
}

@Resolver(_ => Plan)
export class PlanResolver {
  constructor(
    private readonly repository: Repository<Plan>,
    private readonly userRepository: Repository<User>,
    private readonly exerciseAssignmentRepository: Repository<
      ExerciseAssignment
    >,
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
    @Ctx() { request }: AppContext
  ): Promise<Plan[]> {
    const { authUser } = request;
    const plans = await this.repository.find({
      loadRelationIds: true,
      take,
      skip,
      where: { user: authUser!.id }
    });
    console.log("plans", plans);
    return plans;
  }

  @Authorized()
  @Mutation(_ => Plan)
  async addPlan(
    @Arg("args") { name, description }: AddPlanInput,
    @Ctx() { request }: AppContext
  ) {
    const { authUser } = request;
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

  @FieldResolver(_ => [Training])
  async trainings(@Root() plan: Plan): Promise<Training[]> {
    if (plan.trainings && plan.trainings.length > 0) {
      const trainings = await this.trainingRepository.find({
        where: { id: In(plan.trainings as string[]) },
        loadRelationIds: true
      });
      return trainings;
    }
    return [];
  }

  @FieldResolver()
  async exerciseAssignments(@Root() plan: Plan): Promise<ExerciseAssignment[]> {
    console.log("plan", plan);
    if (plan.exerciseAssignments && plan.exerciseAssignments.length > 0) {
      const exerciseAssignments = await this.exerciseAssignmentRepository.find({
        where: { in: In(plan.exerciseAssignments as string[]) },
        loadRelationIds: true
        // join: {
        //   alias: "assignment",
        //   leftJoinAndSelect: {
        //     exercise: "assignment.exercise"
        //   }
        // }
      });
      console.log("exerciseAssignments", exerciseAssignments);
      return exerciseAssignments;
    }
    return [];
  }

  @Authorized()
  @Mutation(_ => Plan)
  async addExercisesToPlan(
    @Arg("planId") planId: string,
    @Arg("exercises", _ => [AddExerciseInput]) exercises: AddExerciseInput[]
  ): Promise<Plan> {
    const plan = await this.repository.findOneOrFail(planId);
    await Promise.all(
      exercises
        .map(async exercise => {
          const pair: [AddExerciseInput, Exercise] = [
            exercise,
            await this.exerciseRepository.findOneOrFail(exercise.id)
          ];
          return pair;
        })
        .map(async prom => {
          const [
            { oneRepMax, targetReps, targetVolume, targetWeight },
            { id }
          ]: [AddExerciseInput, Exercise] = await prom;
          this.exerciseAssignmentRepository.save(
            new ExerciseAssignment(
              random.id(),
              planId,
              id,
              targetVolume,
              targetWeight,
              targetReps,
              oneRepMax
            )
          );
        })
    );
    return await this.repository.findOneOrFail(plan.id, {
      loadRelationIds: true
    });
  }

  // @Authorized()
  // @Mutation(_ => Plan)
  // async removeExercisesFromPlan(
  //   @Arg("planId") planId: string,
  //   @Arg("exerciseIds", _ => [String]) exerciseIds: string[]
  // ): Promise<Plan> {
  //   const plan = await this.repository.findOneOrFail(planId, {
  //     relations: ["exercises"]
  //   });
  //   const exercises = await this.exerciseRepository.find({
  //     where: { id: In(exerciseIds) }
  //   });
  //   const filteredExercises = (plan.exercises as Exercise[]).filter(
  //     (exercise: Exercise) => exercises.indexOf(exercise) !== -1
  //   );
  //   plan.exercises = filteredExercises;
  //   const updatedPlan = await this.repository.save(plan);
  //   return updatedPlan;
  // }
}
