const express = require('express');
const router = express.Router();
const {getActivityByName, getAllActivities, updateActivity, getPublicRoutinesByActivity, createActivity, getActivityById } = require('../db');
const { ActivityNotFoundError } = require('../errors');

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next)=> {
    const { activityId } = req.params;
    const obj = {id: activityId}
    const activity = await getActivityById(activityId)

    try {
        if (!activity){
            next({
                error: 'ActivityNotFoundError',
                message: `Activity ${ activityId } not found`,
                name: 'ActivityNotFoundError'
            });
        }
        const publicRoutinesByActivity = await getPublicRoutinesByActivity(obj);

        res.send(publicRoutinesByActivity)

    } catch (error) {
        next(error)
    }
})

// GET /api/activities
router.get('/', async (req, res, next)=>{
    try{
        const allActivities = await getAllActivities()

        res.send(allActivities)

    } catch(error) {
        next(error)
    }
});

// POST /api/activities
router.post('/', async (req, res, next) =>{
    const { name, description } = req.body;
    const activity = await getActivityByName(name);
    const activityData = {name: name, description:description};
    const newActivity = await createActivity(activityData);
    if(!activity){
        res.send(newActivity)
    }

    if(activity) {
        next({
            error: 'Activity Already Exists',
            name: 'MissingUserError',
            message: `An activity with name Push Ups already exists`,
        });
    }
});

// PATCH /api/activities/:activityId

router.patch('/:activityId', async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  const activityFields = {id:activityId, name:name, description:description}
  const activity = await getActivityById(activityId);
  try {
    if (!activity) {
      next({
        error: 'ActivityNotFoundError',
        message: `Activity ${activityId} not found`,
        name: 'ActivityNotFoundError',
      });
    }
    const activityNameCheck = await getActivityByName(name)
    if (activityNameCheck) {
      next({
        name: 'Activity Exists',
        error: 'Extant Activity',
        message: `An activity with name ${name} already exists`,
      })
    }
    const updatedActivity = await updateActivity(activityFields);
    res.send(updatedActivity)
  } catch (error) {
    next(error);
  }
});



module.exports = router;
