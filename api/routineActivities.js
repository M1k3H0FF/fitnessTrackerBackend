const express = require('express');
const router = express.Router();
const {getRoutineActivityById, destroyRoutineActivity, getActivityById, canEditRoutineActivity, updateRoutineActivity} = require('../db');
const {requireUser} = require('./utils')

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    console.log(count, "count", duration, "duration", routineActivityId, "yup")
    const routineActivityFields = {id:routineActivityId, count:count, duration:duration}
    const activity = await getRoutineActivityById(routineActivityId);
    console.log(req.user, "line 13 ush")
    console.log(activity, 'line 14 again')
    
    try {
    //   if (!activity) {
    //     next({
    //       error: 'ActivityNotFoundError',
    //       message: `Activity ${routineActivityId} not found`,
    //       name: 'ActivityNotFoundError',
    //     });
    //   }
    //   const activityNameCheck = await getActivityByName(name)
    //   if (activityNameCheck) {
    //     next({
    //       name: 'Activity Exists',
    //       error: 'Extant Activity',
    //       message: `An activity with name ${name} already exists`,
    //     })
    //   }
      const updatedRoutineActivity = await updateRoutineActivity(routineActivityFields);
      res.send(updatedRoutineActivity)
    } catch (error) {
      next(error);
    }
  });

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    try {
      const routineActivity = await getRoutineActivityById(req.params.routineActivityId);
      console.log(req.user.username, 'line 13 oooooo')
      const banana = await getActivityById(routineActivity.activityId)
      const apple = await canEditRoutineActivity(routineActivityId, req.user.id)
      console.log(routineActivityId, "line 16")

     if (apple){
        await destroyRoutineActivity(routineActivityId);
        res.send(routineActivity);
      } else {
        next({
          status: 403,
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
