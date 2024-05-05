const request = require("supertest");
const server = require("../api/server");
const db = require("../database/db-config");

beforeAll(async () => {
  await db.migrate.latest();
  await db("users").truncate();
});

const input = {
  password: "testing",
  email: "testing@gmail.com",
};

describe("users authorization", () => {
  describe("POST user register and login", () => {
    test("should return 201, with correct email", async () => {
      const response = await request(server)
        .post("/auth/register")
        .send(input)
        .expect(201)

      username = response.body.email;
      expect(username).toEqual("testing@gmail.com");
    });

    test("should return 200, with token returned", async () => {
      const response = await request(server)
        .post("/auth/login")
        .send(input)
        .expect(200);

      token = response.body.token;
      expect(token).toBeDefined();
    });

    test("should return 401 for unregistered user without token", async () => {
      const response = await request(server)
        .post("/auth/login")
        .send({
          password: "sample",
          email: "unregisteredg@gmail.com",
        })
        .expect(401);

      token = response.body.token;
      expect(token).toBeUndefined();
    });
  });
});
