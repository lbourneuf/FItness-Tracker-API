/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const {
  getUserByUsername,
  getUserById,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
} = require("../db");
const { createUser } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      res.send({
        error: "UserExistsError",
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    }

    if (password.length < 8) {
      res.send({
        error: "PasswordTooShortError",
        message: "Password Too Short!",
        name: "PasswordCreationError",
      });
    }
    const user = await createUser({
      username,
      password,
    });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET
    );

    res.send({
      message: "thank you for signing up",
      token,
      user: {
        id: user.id,
        username,
      },
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  //   console.log("This is the username", username);

  if (!username || !password) {
    res.send({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  //   console.log("This is the token", token);
  try {
    const user = await getUserByUsername(username);
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET);
    const hashedPassword = user.password;
    const isValid = await bcrypt.compare(password, hashedPassword);

    // console.log("This is the password", password);
    if (user && isValid) {
      res.send({
        message: "you're logged in!",
        user: {
          id: user.id,
          username,
        },
        token: token,
      });
    } else {
      res.send({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// GET /api/users/me
router.get("/me", async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    res.status(401).send({
      error: "UnauthorizedUserError",
      message: "You must be logged in to perform this action",
      name: "SomeError",
    });
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        res.send(req.user);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});
// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  try {
    const users = await getUserByUsername(username);
    const publicRoutines = await getPublicRoutinesByUser(users);
    const routines = await getAllRoutinesByUser(users);

    if (req.user.username === username) {
      res.send(routines);
    } else {
      res.send(publicRoutines);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
