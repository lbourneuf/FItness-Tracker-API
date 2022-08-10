const express = require("express");

const router = express.Router();
const {
  getActivityByName,
  getAllActivities,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
  getActivityById,
} = require("../db");

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;

  const activityBy = await getActivityById(activityId);
  if (!activityBy) {
    next({
      message: `Activity ${activityId} not found`,
      name: "ActivityDoesNotExist",
    });
  }
  try {
    const publicRoutine = await getPublicRoutinesByActivity(activityBy);
    res.send(publicRoutine);
  } catch (error) {
    next(error);
  }
});
// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// POST /api/activities
router.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const activity = await createActivity({ name, description });
    res.send(activity);
  } catch (error) {
    next({
      error: "ActivityExistsError",
      message: `An activity with name ${name} already exists`,
      name: "ActivityExistsError",
    });
  }
});
// PATCH /api/activities/:activityId
router.patch("/:activityId", async (req, res, next) => {
  const { name, description } = req.body;
  const { activityId } = req.params;

  try {
    const doesExist = await getActivityById(activityId);
    const oldActivity = await getActivityByName(name);
    if (oldActivity) {
      next({
        error: "Error",
        name: "ActivityExistsError",
        message: `An activity with name ${name} already exists`,
      });
    }
    if (!doesExist) {
      next({
        error: "Error",
        name: "ActivityNotFoundError",
        message: `Activity ${activityId} not found`,
      });
    }
    const updatedActivity = await updateActivity({
      id: activityId,
      name,
      description,
    });
    res.send(updatedActivity);
  } catch (error) {
    console.log("this is the terrrible erooorrrrorr", error);
    next(error);
  }
});

module.exports = router;
