/* eslint-disable no-useless-catch */
const express = require("express");
const {
  getRoutineActivityById,
  canEditRoutineActivity,
  updateRoutineActivity,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("./utils");
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { duration, count } = req.body;

  try {
    const user = req.user;

    const routineActivity = await getRoutineActivityById(routineActivityId);
    const routine = await getRoutineById(routineActivity.routineId);

    const canEdit = await canEditRoutineActivity(
      routineActivityId,
      req.user.id
    );
    if (canEdit) {
      const updatedRoutineActivity = await updateRoutineActivity({
        id: routineActivityId,
        duration,
        count,
      });
      res.send(updatedRoutineActivity);
    } else {
      next({
        error: "Error",
        name: "UnauthorizedUpdateError",
        message: `User ${user.username} is not allowed to update ${routine.name}`,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  console.log("iiiiiiiiiiiooooo", routineActivityId);
  try {
    const routineActivity = await getRoutineActivityById(routineActivityId);
    const routine = await getRoutineById(routineActivity.routineId);

    const canEdit = await canEditRoutineActivity(
      routineActivityId,
      req.user.id
    );
    if (canEdit) {
      const deleeeete = await destroyRoutineActivity(routineActivityId);

      res.send(deleeeete);
    } else {
      res.status(403).send({
        error: "UnauthorizedDeleteError",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
        name: "UnauthorizedDeleteError",
      });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
