import cors from "cors";
import { Request, Response } from "express";
import { GraphQLServer } from "graphql-yoga";
import path from "path";
import { AuthChecker, buildSchema, BuildSchemaOptions } from "type-graphql";
import { config } from "./config";
import { User } from "./entities";
import { asyncWrap, authenticate } from "./middlewares";
import { IocContainer } from "./ioc-container";

const authChecker: AuthChecker<{ request: { authUser?: User } }> = ({
  context
}) => {
  return Boolean(context.request.authUser);
};

export interface AppContext {
  request: Request;
  response: Response;
}

export async function setupGraphQlServer(container: IocContainer) {
  const schemaOptions: BuildSchemaOptions = {
    resolvers: [
      `${__dirname}/**/resolvers/*.ts`,
      `${__dirname}/**/resolver.ts`
    ],
    emitSchemaFile: {
      path: path.resolve(__dirname, "schema.gql")
    },
    authChecker,
    container
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
