import "reflect-metadata";
import { db } from "./db";
import { setupGrapgQlServer } from "./server";
import { logger } from "./services/logger";

async function startApp() {
  await db();
  const server = await setupGrapgQlServer();
  await server.start(
    {
      // playground: false,
      // endpoint: "/graphql"
    },
    () => logger.info("GraphQL server running on http://localhost:4000")
  );
}

startApp().catch(console.error);
