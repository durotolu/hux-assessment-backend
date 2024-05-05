const db = require("../database/db-config");

module.exports = {
  findById,
  add,
  findByEmail,
};

function findById(id) {
  return db("users").where({ id }).first();
}

async function add(user) {
  const [{ id }] = await db("users").insert(user, "id");
  return findById(id);
}

function findByEmail(email) {
  return db("users").where({ email }).first();
}
