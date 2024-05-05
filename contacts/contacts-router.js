const router = require("express").Router();

const Contacts = require("./contacts-model");
const midware = require("../middleware/middleware");

router.post(
  "/",
  [midware.verifyToken, midware.checkContactInput],
  (req, res) => {
    Contacts.add(req.body)
      .then((contact) => {
        res.status(201).json(contact);
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  }
);

router.get("/:user_id", midware.verifyToken, (req, res) => {
  Contacts.findByUserId(req.params.user_id)
    .then((contacts) => {
      res.status(200).json(contacts);
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
});

router.get("/contact/:id", midware.verifyToken, (req, res) => {
  Contacts.findById(req.params.id)
    .then((contact) => {
      res.status(200).json(contact);
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
});

router.put(
  "/:id",
  [midware.verifyToken, midware.checkContactInput],
  (req, res) => {
    Contacts.update(req.params.id, req.body)
      .then((contact) => {
        res.status(201).json(contact);
      })
      .catch((error) => {
        res.status(500).json({
          "error updating contact": error.message,
        });
      });
  }
);

router.delete("/:id", midware.verifyToken, (req, res) => {
  Contacts.remove(req.params.id)
    .then((info) => {
      res.status(200).json({ message: `removed ${info} contact` });
    })
    .catch((error) => {
      res.status(500).json({
        "error removing contact": error.message,
      });
    });
});

module.exports = router;
