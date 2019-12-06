const express = require("express");
const actions = require("./actionModel");
const projects = require("./projectModel");

const router = express.Router();

router.get("/:id", validateActionId, async (req, res) => {
  res.status(200).json(req.action);
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

module.exports = router;
