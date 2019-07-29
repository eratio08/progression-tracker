import "reflect-metadata";
import { db } from "./db";
import { server } from "./server";

db();
server.start(() => "GraphQL server running on :4000");
