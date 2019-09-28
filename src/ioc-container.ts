import { ObjectType, Repository, Connection } from "typeorm";
import { db } from "./db";
import {
  AuthResolver,
  Exercise,
  ExerciseExecution,
  ExerciseResolver,
  Plan,
  PlanResolver,
  Training,
  TrainingResolver,
  User,
  UserResolver
} from "./entities";
import { ExerciseExecutionResolver } from "./entities/exercise-execution/resolver";

export type IocContainer = { get<T>(someClass: ObjectType<T>): T };

const UserRepository = "UserRepository";
const PlanRepository = "PlanRepository";
const ExerciseRepository = "ExerciseRepository";
const ExerciseExecutionRepository = "ExerciseExecutionRepository";
const TrainingRepository = "TrainingRepository";

export const setUpIocContainer = async (): Promise<IocContainer> => {
  const container = new Container();
  const connection = await db().connect();
  container.putInstance(connection);
  container.putInstance(connection.getRepository(User), UserRepository);

  container.putInstance(connection.getRepository(Plan), PlanRepository);
  container.putInstance(connection.getRepository(Exercise), ExerciseRepository);
  container.putInstance(
    connection.getRepository(ExerciseExecution),
    ExerciseExecutionRepository
  );
  container.putInstance(
    connection.getRepository(Training),
    "TrainingRepository"
  );
  container.register(UserResolver, UserRepository, PlanRepository);
  container.register(AuthResolver, UserRepository);
  container.register(
    PlanResolver,
    PlanRepository,
    UserRepository,
    ExerciseRepository,
    TrainingRepository
  );
  container.register(TrainingResolver, TrainingRepository, PlanRepository);
  container.register(ExerciseResolver, ExerciseRepository);
  container.register(
    ExerciseExecutionResolver,
    ExerciseExecutionRepository,
    TrainingRepository,
    ExerciseRepository
  );

  return container;
};

class Container {
  private dic: Record<string, unknown | undefined> = {};
  public get<T>(someClass: ObjectType<T> | string): T {
    const className =
      typeof someClass === "string" ? someClass : someClass.name;
    const instance = this.dic[className];
    if (!instance) {
      throw new Error(
        `No instance found for class/token ${
          typeof someClass === "string" ? someClass : someClass.name
        }`
      );
    }
    return instance as T;
  }
  public register(
    classSpec:
      | ObjectType<unknown>
      | { someClass: ObjectType<unknown>; token: string },
    ...constructorArgs: Array<ObjectType<unknown> | string>
  ) {
    const dependencies = constructorArgs.map(token => this.get(token));
    if ("token" in classSpec) {
      this.dic[classSpec.token] = this.newInstance(
        classSpec.someClass,
        dependencies
      );
    } else {
      this.dic[classSpec.name] = this.newInstance(classSpec, dependencies);
    }
  }
  public putInstance(instance: object, token?: string) {
    if (!token) {
      const type = instance.constructor;
      this.dic[type.name] = instance;
    } else {
      this.dic[token] = instance;
    }
  }

  private newInstance(classConst: ObjectType<unknown>, deps: unknown[]) {
    if (classConst.length !== deps.length) {
      throw new Error(
        `${classConst.name} is missing constructor arguments. Expected ${classConst.length} but got ${deps.length}.`
      );
    }
    return new (Function.prototype.bind.apply(classConst, [null, ...deps]))();
  }
}
