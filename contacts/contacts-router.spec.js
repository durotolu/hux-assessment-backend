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

const mockContactData = {
  firstname: "John",
  lastname: "Doe",
  phone_number: "12345",
};

describe("POST add new contact", () => {
  test("should return 201 and the contact data when request is valid", async () => {
    contactsModel.add.mockResolvedValue(mockContactData);

    const response = await request(server)
      .post("/api/contacts")
      .send(mockContactData)
      .expect(201);

    expect(response.body).toEqual(mockContactData);
  });

  test("should return 500 and an error message when Contacts.add throws an error", async () => {
    const errorMessage = "Internal Server Error";
    contactsModel.add.mockRejectedValue(new Error(errorMessage));

    const response = await request(server)
      .post("/api/contacts")
      .send(mockContactData)
      .expect(500);

    expect(response.text).toContain(errorMessage);
  });
});

describe("PUT update existing contact", () => {
  test("should return 201 and the updated contact data when request is valid", async () => {
    const mockContactId = 1;
    const mockUpdatedContactData = {
      firstname: "Updated Firstname",
      lastname: "Updated Lastname",
      phone_number: "54321",
    };
    contactsModel.update = jest.fn().mockResolvedValue(mockUpdatedContactData);

    const response = await request(server)
      .put(`/api/contacts/${mockContactId}`)
      .send(mockUpdatedContactData)
      .expect(201);

    expect(response.body).toEqual(mockUpdatedContactData);
  });

  test("should return 500 and error message when update operation fails", async () => {
    const mockContactId = 1;
    const mockUpdatedContactData = {
      firstname: "Updated Firstname",
      lastname: "Updated Lastname",
      phone_number: "54321",
    };
    const errorMessage = "Update operation failed";
    contactsModel.update = jest.fn().mockRejectedValue(new Error(errorMessage));

    const response = await request(server)
      .put(`/api/contacts/${mockContactId}`)
      .send(mockUpdatedContactData)
      .expect(500);

    expect(response.body).toEqual({ "error updating contact": errorMessage });
  });
});
