import "reflect-metadata";
import { db } from "./db";
import { setupGrapgQlServer } from "./server";
import { logger } from "./services/logger";

async function startApp() {
  await db();
  const server = await setupGrapgQlServer();
  const options = {
    // playground: false,
    // endpoint: "/graphql"
    defaultPlaygroundQuery: `mutation {
  login(email: "admin@elurz.de", password: "1234") {
    id
    name
  }
}`
  };

  await server.start(options, () =>
    logger.info("GraphQL server running on http://localhost:4000")
  );
}

startApp().catch(console.error);
