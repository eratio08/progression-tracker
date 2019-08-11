import cors from "cors";
import { Request, Response } from "express";
import { GraphQLServer } from "graphql-yoga";
import path from "path";
import { AuthChecker, buildTypeDefsAndResolvers } from "type-graphql";
import { config } from "./config";
import { User, UserResolver } from "./entities";
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

export async function setupGrapgQlServer() {
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [AuthResolver, UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    authChecker
  });

  const server = new GraphQLServer({
    resolvers,
    typeDefs,
    context: ({ request, response }) => ({
      request,
      response
    })
  });

  server.express.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
  server.express.use(asyncWrap(authenticate()));

  return server;
}
