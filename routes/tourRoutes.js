const express = require("express");
const tourController = require("./../controllers/tourController");


//create a mini app for the tours router
const router = express.Router();

// router.param('id', tourController.checkId) //this is a params middleware that works on the tours/id only

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);
 
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
