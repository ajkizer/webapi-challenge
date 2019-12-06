const express = require("express");
const projects = require("./projectModel");

const router = express.Router();

router.get("/:id", validateProjectId, async (req, res) => {
  res.status(200).json(req.project);
});

router.get("/:id/actions", validateProjectId, async (req, res) => {
  res.status(200).json(req.project.actions);
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

module.exports = router;
