import cors from "cors";
import { Request, Response } from "express";
import { GraphQLServer } from "graphql-yoga";
import path from "path";
import { AuthChecker, buildSchema, BuildSchemaOptions } from "type-graphql";
import { Connection, ObjectType } from "typeorm";
import { config } from "./config";
import {
  Exercise,
  ExerciseExecution,
  ExerciseResolver,
  Plan,
  PlanResolver,
  Training,
  User,
  UserResolver
} from "./entities";
import { ExerciseExecutionResolver } from "./entities/exercise-execution/resolver";
import { TrainingResolver } from "./entities/training/resolver";
import { asyncWrap, authenticate } from "./middlewares";
import { AuthResolver } from "./resolvers";

const authChecker: AuthChecker<{ request: { authUser?: User } }> = ({
  context
}) => {
  return Boolean(context.request.authUser);
};

export interface AppContext {
  request: Request;
  response: Response;
}

const setUpIocContainer = (connection: Connection) => {
  const userRepository = connection.getRepository(User);
  const planRepository = connection.getRepository(Plan);
  const exerciseRepository = connection.getRepository(Exercise);
  const exerciseExecutionRepository = connection.getRepository(
    ExerciseExecution
  );
  const trainingRepository = connection.getRepository(Training);

  const dic: { [key: string]: object } = {
    UserResolver: new UserResolver(userRepository, planRepository),
    AuthResolver: new AuthResolver(userRepository),
    PlanResolver: new PlanResolver(
      planRepository,
      userRepository,
      exerciseRepository,
      trainingRepository
    ),
    TrainingResolver: new TrainingResolver(trainingRepository, planRepository),
    ExerciseResolver: new ExerciseResolver(exerciseRepository),
    ExerciseExecutionResolver: new ExerciseExecutionResolver(
      exerciseExecutionRepository,
      trainingRepository,
      exerciseRepository
    )
  };

  return {
    get(someClass: ObjectType<unknown>): unknown {
      const instance = dic[someClass.name];
      if (!instance) {
        throw new Error(
          "Dependency could not be resolved, not instance supplied."
        );
      }
      return instance;
    }
  };
};

export async function setupGraphQlServer(connection: Connection) {
  const schemaOptions: BuildSchemaOptions = {
    resolvers: [
      `${__dirname}/**/resolvers/*.ts`,
      `${__dirname}/**/resolver.ts`
    ],
    emitSchemaFile: {
      path: path.resolve(__dirname, "schema.gql")
    },
    authChecker,
    container: setUpIocContainer(connection)
  };

  const schema = await buildSchema(schemaOptions);

  const server = new GraphQLServer({
    schema,
    context: ({ request, response }) => ({
      request,
      response
    })
  });

  server.express.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
  server.express.use(asyncWrap(authenticate()));

  return server;
}
