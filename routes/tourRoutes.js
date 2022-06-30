const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController ");

//create a mini app for the tours router
const router = express.Router();

// router.param('id', tourController.checkId) //this is a params middleware that works on the tours/id only

router //for alias fetching of tours
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router //for some statistics about our tours resources
  .route("/tour-stats")
  .get(tourController.getTourStats);
router //for some real business problem
  .route("/monthly-plan/:year")
  .get(tourController.getMonthlyPlan);
router
  .route("/")
  .get(authController.protect,tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
