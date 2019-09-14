import "reflect-metadata";
import { setupGraphQlServer } from "./server";
import { logger } from "./services/logger";

async function startApp() {
  const server = await setupGraphQlServer();
  const options = {
    // use same-origin`
    // playground: false,
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
