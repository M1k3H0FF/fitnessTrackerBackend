const express = require('express');
const router = express.Router();
const {getAllActivities, getPublicRoutinesByActivity } = require('../db')

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next)=> {
    const { activityId } = req.params;
    const obj = {id: activityId}
    try {
        if (!activityId){
            return error
        }
        const pablo = await getPublicRoutinesByActivity(obj);
        console.log(pablo, "dudette")
        res.send(pablo)


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

// PATCH /api/activities/:activityId

module.exports = router;
