import "reflect-metadata";
import { db } from "./db";
import { setupGrapgQlServer } from "./server";

async function startApp() {
  await db();
  const server = await setupGrapgQlServer();
  await server.start(
    {
      // playground: true,
      endpoint: "/graphql"
    },
    () => console.log("GraphQL server running on http://localhost:4000")
  );
}

startApp();
