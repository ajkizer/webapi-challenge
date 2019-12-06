const express = require("express");
const projects = require("./projectModel");

const router = express.Router();

router.get("/:id", validateProjectId, async (req, res) => {
  res.status(200).json(req.project);
});

router.get("/:id/actions", validateProjectId, async (req, res) => {
  res.status(200).json(req.project.actions);
});

router.post("/", validateText, async (req, res) => {
  try {
    await projects.insert(req.body);
    res.status(201).json(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error processing request"
    });
  }
});

async function validateProjectId(req, res, next) {
  try {
    const { id } = req.params;
    const projectGet = await projects.get(id);
    if (projectGet) {
      req.project = projectGet;
      next();
    } else {
      res.status(404).json({ message: "project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "failed to process request" });
  }
}

async function validateText(req, res, next) {
  try {
    if (req.body.name.length > 0 && req.body.description.length > 0) {
      console.log("validated text");
      next();
    } else {
      res.status(400).json({ message: "please fill out required fields" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error processing request" });
  }
}
module.exports = router;
