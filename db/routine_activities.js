const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [create_activities],
    } = await client.query(
      `
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT("routineId", "activityId") DO NOTHING
      RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );
    return create_activities;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getRoutineActivityById(id) {
  if (!id) {
    return;
  }
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
      SELECT * 
      FROM routine_activities
      WHERE id=$1;
    
    `,
      [id]
    );
    return routine_activity;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  if (!id) {
    return;
  }
  try {
    const { rows: routine_activity } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE "routineId"=$1
    `,
      [id]
    );
    console.log("this is the routine activity:", routine_activity);
    return routine_activity;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateRoutineActivity({ id, count, duration }) {
  try {
    const {
      rows: [routineActivities],
    } = await client.query(
      `
          UPDATE routine_activities
          SET count=$1, duration=$2
          WHERE id=${id}
          RETURNING *;
        `,
      [count, duration]
    );
    return routineActivities;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [removed],
    } = await client.query(
      `
      DELETE FROM routine_activities
      WHERE id=$1
      RETURNING *;
    `,
      [id]
    );

    return removed;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
      SELECT * 
      FROM routine_activities
      WHERE id=$1
    `,
      [routineActivityId]
    );

    const {
      rows: [creator],
    } = await client.query(
      `
      SELECT *
      FROM routines
      WHERE id=$1
    `,
      [routineActivity.routineId]
    );

    if (userId === creator.creatorId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
