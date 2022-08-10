const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");
async function createRoutine({ creatorId, isPublic, name, goal }) {
  if (!creatorId) {
    return;
  }
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );
    // console.log("This is the routine: ", routine);
    return routine;
  } catch (error) {
    console.log("problem creating routine");
    throw error;
  }
}

async function getRoutineById(id) {
  if (!id) {
    return;
  }
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      SELECT * 
      FROM routines
      WHERE id=$1
    `,
      [id]
    );
    return routine;
  } catch (error) {
    console.log("error");
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routines;
    `);
    // console.log("Something obnoxious", rows);
    return rows;
  } catch (error) {
    console.log("error");
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id;
    `);

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log("error");
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    AND routines."isPublic" != false
    `);

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log("error");
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    AND users.username = ($1);
    `,
      [username]
    );

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log("error");
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      AND routines."isPublic" != false
      AND users.username = ($1);
    
    `,
      [username]
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    AND routines."isPublic" != false;
    `);
    const routinesWithActivities = await attachActivitiesToRoutines(routines);

    let routinesToReturn = [];

    for (const routine of routinesWithActivities) {
      for (const activity of routine.activities) {
        if (activity.id === id) {
          routinesToReturn.push(routine);
        }
      }
    }

    return routinesToReturn;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routines],
    } = await client.query(
      `
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    
    `,
      Object.values(fields)
    );
    return routines;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(
      `
      DELETE FROM routine_activities
      WHERE "routineId"=($1)
      RETURNING *;
    `,
      [id]
    );

    const deleteRoutines = await client.query(
      `
      DELETE FROM routines
      WHERE id=($1)
      RETURNING *;
    
    `,
      [id]
    );
    return deleteRoutines;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
