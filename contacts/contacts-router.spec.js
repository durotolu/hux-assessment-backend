const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("../database/db-config");

const contactsRouter = require("./contacts-router");
const contactsModel = require("./contacts-model");

const server = express();
server.use(bodyParser.json());

server.use("/api/contacts", contactsRouter);

beforeAll(async () => {
  await db.migrate.latest();
  await db("contacts").truncate();
});

jest.mock("./contacts-model.js", () => ({
  add: jest.fn(),
}));

describe("POST add new contact", () => {
  test("should return 201 and the contact data when request is valid", async () => {
    const mockContactData = {
      firstname: "John",
      lastname: "Doe",
      phone_number: "12345",
    };

    contactsModel.add.mockResolvedValue(mockContactData);

    const response = await request(server)
      .post("/api/contacts")
      .send(mockContactData)
      .expect(201);

    expect(response.body).toEqual(mockContactData);
  });
});
