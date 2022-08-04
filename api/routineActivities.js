const express = require('express');
const router = express.Router();
const {getRoutineActivityById, destroyRoutineActivity, getActivityById, canEditRoutineActivity, updateRoutineActivity, getRoutineById} = require('../db');
const {requireUser} = require('./utils')

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', async (req, res, next) => {
    console.log(req.user.id, 'line 8')
    const { routineActivityId } = req.params;
    try {
      const routineActivity = await getRoutineActivityById(req.params.routineActivityId);
      const banana = await getRoutineById(routineActivity.routineId)
      const apple = await canEditRoutineActivity(routineActivityId, req.user.id)
      const {count, duration} = req.body
     if (apple){
        const newThing = await updateRoutineActivity({id:routineActivityId, count, duration});
        res.send(newThing);
      } else {
        res.status(403)
        next({
          name: '403Error',
          error: 'An Error Occured',
          message: `User ${req.user.username} is not allowed to update ${banana.name}`,
        });
      }
        } catch (error) {
      next(error);
    }
  });

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    try {
      const routineActivity = await getRoutineActivityById(req.params.routineActivityId);
      const banana = await getRoutineById(routineActivity.activityId)
      const apple = await canEditRoutineActivity(routineActivityId, req.user.id)
      console.log(routineActivity)
     if (apple){
        await destroyRoutineActivity(routineActivityId);
        res.send(routineActivity);
      } else {
        res.status(403)
        next({
          name: '403Error',
          error: 'An Error Occured',
          message: `User ${req.user.username} is not allowed to delete ${banana.name}`,
        });
      }
        } catch (error) {
      
      next(error);
    }
  });
module.exports = router;
