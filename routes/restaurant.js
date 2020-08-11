const express = require ('express');

const router = express.Router();


router.get('/', (req,res)=>{
    res.status(200).json({success: true});
})

//get single by id 
router.get('/:id', (req, res)=>{
    const restaurantId = req.params.id;
    console.log(restaurantId);
    res.status(200).json({success : true, id: restaurantId}).s
})
//post 1
// put by id
// delete by id


module.exports = router;