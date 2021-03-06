import supertest from "supertest";
import { Connection } from "typeorm";
import { User } from "./entities";
import { setUpIocContainer } from "./ioc-container";
import { setupGraphQlServer } from "./server";

export interface TestScenario {
  session: supertest.SuperTest<supertest.Test>;
  authenticateWith(user: User): void;
  createGqlQuery(query: string): { query: string };
  createGqlMutation(mutation: string): { query: string };
  admin: User;
}

export const setupTestScenario = async (): Promise<TestScenario> => {
  const container = await setUpIocContainer();
  const app = await setupGraphQlServer(container);
  const server = await app.createHttpServer({ endpoint: "/" });
  const session = supertest.agent(server);

  const entityManager = container
    .get<Connection>(Connection.constructor)
    .createEntityManager();
  const admin = await entityManager.findOne(User, undefined, {
    where: { email: "admin@elurz.de" }
  });
  if (!admin) {
    throw new Error("Admin user not found");
  }
  // const admin = new User(
  //   random.id(),
  //   "admin@example.com",
  //   "Admin",
  //   await password.hash("password"),
  //   UserRole.ADMIN
  // );
  // await entityManager.save(admin);
  return {
    createGqlQuery: (query: string) => ({ query: `query ${query}` }),
    createGqlMutation: (mutation: string) => ({
      query: `mutation ${mutation}`
    }),
    session,
    async authenticateWith(user: User) {
      await session.post("/npm run").send({
        query: `mutation {  login(email: "${user.email}" password: "Admin") {  id }}`
      });
    },
    admin
  };
};
