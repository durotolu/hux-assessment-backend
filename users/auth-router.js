const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Auth = require("./users-model");
const generateToken = require("../helpers/generateToken");
const midware = require("../middleware/middleware");

router.post("/register", midware.checkAuthInput, (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  Auth.findByEmail(user.email).then((data) => {
    if (data) {
      res.status(409).json({ message: "Email already exists" });
    } else {
      Auth.add(user)
        .then((saved) => {
          saved.password = null;
          res.status(201).json(saved);
        })
        .catch((error) => {
          res.status(500).json(error.message);
        });
    }
  });
});

router.post("/login", midware.checkAuthInput, async (req, res) => {
  let user = await req.body;
  Auth.findByEmail(user.email)
    .then((data) => {
      if (data && bcrypt.compareSync(user.password, data.password)) {
        const token = generateToken(data);
        res.status(200).json({
          message: `Welcome ${data.email}`,
          token: token,
          user_id: data.id,
          email: data.email,
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((error) => {
      res.status(500).json(error.message);
    });
});

router.post("/logout", midware.checkAuthInput, async (req, res) => {
});

module.exports = router;
