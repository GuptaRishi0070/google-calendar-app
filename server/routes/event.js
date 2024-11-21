
const express = require("express");
const Event = require("../models/Event");
const router = express.Router();

router.post("/create", async (req, res) => {
  const { userId, title, description, startDate, endDate } = req.body;

  try {
    const newEvent = new Event({
      userId,
      title,
      description,
      startDate,
      endDate,
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: "Error creating event" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const events = await Event.find({ userId: req.params.userId });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

module.exports = router;
