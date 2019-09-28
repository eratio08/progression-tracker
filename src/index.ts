import "reflect-metadata";
import { setupGraphQlServer } from "./server";
import { logger } from "./services/logger";
import { setUpIocContainer } from "./ioc-container";

async function startApp() {
  const container = await setUpIocContainer();
  const server = await setupGraphQlServer(container);
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
