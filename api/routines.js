const express = require('express');
const {
  getAllPublicRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
  addActivityToRoutine
} = require("../db");
const { requireUser } = require('./utils');
const router = express.Router();
// GET /api/routines
router.get('/', async (req, res, next) => {
  try {
    const allPubRoutines = await getAllPublicRoutines();
    res.send(allPubRoutines);
  } catch (error) {
    next(error);
  }
});
// POST /api/routines
router.post('/', requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const routineData = {};
  try {
    routineData.creatorId = req.user.id;
    routineData.isPublic = isPublic;
    routineData.name = name;
    routineData.goal = goal;
    const newRoutine = await createRoutine(routineData);
    res.send(newRoutine);
  } catch (error) {
    next();
  }
});
// PATCH /api/routines/:routineId
router.patch('/:routineId', requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { isPublic, name, goal } = req.body;
  const updateFields = {};
  updateFields.isPublic = isPublic;
  if (name) {
    updateFields.name = name;
  }
  if (goal) {
    updateFields.goal = goal;
  }
  try {
    const originalRoutine = await getRoutineById(routineId);
    updateFields.id = routineId
    if (originalRoutine.creatorId === req.user.id) {
      const updatedRoutine = await updateRoutine(updateFields);
      res.send( updatedRoutine );
    } else {
      next({
        status: 403,
        name: '403Error',
        error: 'An Error Occured',
        message: `User ${req.user.username} is not allowed to update ${originalRoutine.name}`,
      });
    }
  } catch (error) {
    next();
  }
});
// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  try {
    const routine = await getRoutineById(req.params.routineId);
    if (routine.creatorId === req.user.id){
      await destroyRoutine(routineId);
      res.send(routine);
    } else {
      next({
        status: 403,
        name: '403Error',
        error: 'An Error Occured',
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
      });
    }
  } catch (error) {
    next(error);
  }
});
// POST /api/routines/:routineId/activities
router.post('/:routineID/activities', async (req, res, next) =>{
  const { routineId, activityId, count, duration} = req.body;
  const ActivityToAdd = {};
  if (routineId){
    ActivityToAdd.routineId = routineId;
  }
  if (activityId) {
    ActivityToAdd.activityId = activityId;
  }
  if (count) {
    ActivityToAdd.count = count;
  }
  if (duration) {
    ActivityToAdd.duration = duration;
  }
  // const routineObject = await getRoutineById(routineId);
  // console.log(routineObject, “avacado”)
  // const oldRoutineAct = await getRoutineActivitiesByRoutine(routineObject)
  // console.log(oldRoutineAct, “banana”)
  // console.log(ActivityToAdd, “line 122")
  try{
    // if (ActivityToAdd.activityId === oldRoutineAct.activityId){
    //   res.send({
    //     error: “Activity Duplication Error”,
    //     message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`
    //   });
    // } else {
      const routinePlusOne = await addActivityToRoutine(ActivityToAdd)
      res.send(routinePlusOne)
    // }
  } catch(error){
    next(error)
  }
});
module.exports = router;
