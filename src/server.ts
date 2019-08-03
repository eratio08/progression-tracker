import cors from "cors";
import { Request, Response } from "express";
import { GraphQLServer } from "graphql-yoga";
import path from "path";
import { AuthChecker, buildSchemaSync } from "type-graphql";
import { config } from "./config";
import { User } from "./entities";
import { asyncWrap, authenticate } from "./middlewares";
import { AuthResolver, UserResolver } from "./resolvers";

const authChecker: AuthChecker<{ request: { authUser?: User } }> = ({
  context
}) => {
  return Boolean(context.request.authUser);
};

const schema = buildSchemaSync({
  resolvers: [UserResolver, AuthResolver],
  emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  authChecker
});

export interface MyContext {
  request: Request;
  response: Response;
}

export const server = new GraphQLServer({
  schema,
  context: ({ request, response }) => ({
    request,
    response
  })
});

server.express.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
server.express.use(asyncWrap(authenticate()));
