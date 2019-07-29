import { GraphQLServer } from "graphql-yoga";
import path from "path";
import { buildSchemaSync, AuthChecker } from "type-graphql";
import { asyncWrap, authenticate } from "./middlewares";
import { UserResolver } from "./resolvers/user";
import { User } from "./entities";

const authChecker: AuthChecker<{ request: { authUser?: User } }> = ({
  context
}) => {
  return Boolean(context.request.authUser);
};

const schema = buildSchemaSync({
  resolvers: [UserResolver],
  emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  authChecker
});

export const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({
    request
  })
});

server.express.use(asyncWrap(authenticate()));
