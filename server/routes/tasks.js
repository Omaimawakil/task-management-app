const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    createdBy: req.user.id
  });
  res.json(task);
});

router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user.id });
  res.json(tasks);
});

router.put("/:id", auth, async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    { title, description, status },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

router.delete("/:id", auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
  res.json({ message: "Deleted" });
});

module.exports = router;