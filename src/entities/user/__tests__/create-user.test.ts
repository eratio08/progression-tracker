// // Does not work
// import { setupTestScenario, TestScenario } from "../../../test-utils";
// import { logger } from "../../../services/logger";

// describe("create user test", () => {
//   let scenario: TestScenario;

//   beforeAll(async () => {
//     scenario = await setupTestScenario();
//     scenario.authenticateWith(scenario.admin);
//   });

//   it("should create a new user", async () => {
//     const response = await scenario.session
//       .post("/")
//       .set("Accept", "application/json")
//       .send(
//         scenario.createGqlQuery(
//           `createUser(name="test" email="email@example.com" password="password")`
//         )
//       );
//     logger.debug("Response", response);
//     expect(response.status).toBe(200);
//   });
// });
