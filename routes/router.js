const express = require("express");
const router = new express.Router();
const story = require('./rest/story/story.controller');

//api goes here
router.post("/insertStory", story.insertStory);

router.post("/insertStoryExist", story.insertStoryExist);

router.get("/storyStatus", story.storyStatus);

router.get("/storyDetails", story.storyDetails);


module.exports = router;
