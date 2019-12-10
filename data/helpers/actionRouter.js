const express = require("express");
const actions = require("./actionModel");
const projects = require("./projectModel");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const actionList = await actions.getAll();
    res.status(200).json(actionList);
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
});

router.get("/:id", validateActionId, async (req, res) => {
  res.status(200).json(req.action);
});

router.post("/:id/add", validateText, validateProjectId, async (req, res) => {
  try {
    req.body = {
      ...req.body,
      project_id: req.params.id
    };
    await actions.insert(req.body);
    res.status(201).json(req.body);
  } catch (error) {
    res.status(500).status({ message: "Error adding action" });
  }
});

router.delete("/:id", validateActionId, async (req, res) => {
  try {
    const { id } = req.action;
    await actions.remove(id);
    res.status(200).json({ message: "Action deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete item" });
  }
});

router.put("/:id", validateActionId, async (req, res) => {
  try {
    const id = req.params.id;
    const changes = req.body;
    if (changes) {
      await actions.update(id, changes);
      res.status(200).json({ message: "action updated" });
    } else {
      res.status(400).json({ message: "please enter text" });
    }
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
});

//middleware
async function validateActionId(req, res, next) {
  try {
    const id = req.params.id;
    const actionGet = await actions.get(id);
    if (actionGet) {
      req.action = actionGet;
      next();
    } else {
      res.status(404).json({ message: "action not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve action" });
  }
}

async function validateText(req, res, next) {
  try {
    if (
      req.body.description &&
      req.body.notes.length &&
      req.body.description.length > 0 &&
      req.body.notes.length > 0
    ) {
      req.body.description.length <= 128
        ? next()
        : res.status(400).json({
            message: "Input must be 128 characters or less"
          });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error processing request" });
  }
}

async function validateProjectId(req, res, next) {
  try {
    const id = req.params.id;
    const projectGet = await projects.get(id);
    if (projectGet) {
      req.project = projectGet;
      next();
    } else {
      res.status(404).json({ message: "Project does not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "failed to process request" });
  }
}

module.exports = router;
