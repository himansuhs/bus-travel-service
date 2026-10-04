const express = require("express");
const Bus = require("../models/Bus");

const router = express.Router();

// CREATE BUS
router.post("/", async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ALL BUSES
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET SINGLE BUS
router.get("/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found",
      });
    }

    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE BUS
router.put("/:id", async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found",
      });
    }

    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE BUS
router.delete("/:id", async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found",
      });
    }

    res.status(200).json({
      message: "Bus deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;