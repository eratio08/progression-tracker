"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const graphql_yoga_1 = require("graphql-yoga");
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const config_1 = require("./config");
const middlewares_1 = require("./middlewares");
const user_1 = require("./resolvers/user");
const authChecker = ({ context }) => {
    return Boolean(context.request.authUser);
};
const schema = type_graphql_1.buildSchemaSync({
    resolvers: [user_1.UserResolver],
    emitSchemaFile: path_1.default.resolve(__dirname, "schema.gql"),
    authChecker
});
exports.server = new graphql_yoga_1.GraphQLServer({
    schema,
    context: ({ request, response }) => ({
        request,
        response
    })
});
exports.server.express.use(middlewares_1.asyncWrap(middlewares_1.authenticate()));
exports.server.express.use(cors_1.default({ origin: config_1.config.FRONTEND_URL, credentials: true }));
