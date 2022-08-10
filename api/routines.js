const express = require("express");
const router = express.Router();
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineById,
  getActivityById,
  getRoutineActivitiesByRoutine,
} = require("../db");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { response } = require("../app");
const { json } = require("express");
const { requireUser } = require("./utils");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const publicR = await getAllPublicRoutines();
    res.send(publicR);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;

  try {
    const routine = await createRoutine({
      creatorId: req.user.id,
      isPublic,
      name,
      goal,
    });
    res.send(routine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const { routineId } = req.params;

  try {
    const routinee = await getRoutineById(routineId);

    if (routinee.creatorId === req.user.id) {
      const routine = await updateRoutine({
        id: routineId,
        isPublic,
        name,
        goal,
      });
      res.send(routine);
    } else {
      res.status(403).send({
        error: "UnauthorizedUser",
        name: "fsdfsdfsd",
        message: `User ${req.user.username} is not allowed to update ${routinee.name}`,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;

  try {
    const routinee = await getRoutineById(routineId);

    if (routinee.creatorId === req.user.id) {
      const destroyyy = await destroyRoutine(routineId);
      // console.log("THis is destoryyyy", destroyyy);
      res.send(destroyyy.rows[0]);
    } else {
      res.status(403).send({
        error: "UnauthorizedUser",
        name: "fsdfsdfsd",
        message: `User ${req.user.username} is not allowed to delete ${routinee.name}`,
      });
    }
  } catch (error) {
    next(error);
  }
});
// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
  const { routineId, activityId, count, duration } = req.body;
  // const actId = await getActivityById(activityId);
  // console.log("This is it", actId);

  // const { routineId } = req.params;
  // const { activityId, count, duration } = req.body;
  console.log("tytytytytytytytytyytyt", routineId);

  const blah = await getRoutineActivitiesByRoutine({ id: routineId });

  console.log("This is blah", blah);
  // console.log("This is the activity id", activityId);
  // console.log("This is the other activity id", blah[0].activityId);

  try {
    if (blah.length === 0) {
      const add = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });

      res.send(add);
    } else if (blah[0].activityId !== activityId) {
      const add = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });

      res.send(add);
    } else {
      res.send({
        error: "Error",
        message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
        name: "ThisIsAnErrorName",
      });
    }
    // console.log("This is the addd", add);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
