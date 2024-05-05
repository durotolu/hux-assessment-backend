const db = require("../database/db-config");

module.exports = {
  findById,
  findByUserId,
  add,
  update,
  remove,
};

function findById(id) {
  let query = db("contacts").select("*").where("id", id).first();

  return query;
}

function findByUserId(id) {
  let query = db("contacts").select("*").where("user_id", id);

  return query;
}

async function add(contact) {
  const [{ id }] = await db("contacts").insert(contact, "id");
  console.log(id);

  return findById(id);
}

function update(id, changes) {
  return db("contacts")
    .where("id", id)
    .update(changes)
    .then((count) => (count > 0 ? findById(id) : null));
}

function remove(id) {
  return db("contacts").where("id", id).del();
}
