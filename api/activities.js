const express = require('express');
const router = express.Router();
const {getAllActivities, getPublicRoutinesByActivity, createActivity, getActivityById } = require('../db');
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
    
    if(!req.user) {
        next({
            name: 'MissingUserError',
            message: 'You must be logged in to perform this action'
        });
    }

    const { name, description } = req.body;
    const activityData = {name: name, description:description}

    const newActivity = await createActivity(activityData)
    res.send(newActivity)
});

// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res, next)=>{
    const { activityId } = req.params;
    const obj = {id: activityId}

    const activity = await getActivityById(activityId)
    try {
        if (!activity){
            res.send({
                error: 'ActivityNotFoundError',
                message: `Activity ${ activityId } not found`,
                name: 'ActivityNotFoundError'
            });
        }
    } catch (error) {
        next(error)
    }
});

module.exports = router;
