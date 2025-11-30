const express = require("express");
const router = express.Router();
const {
  getOwners,
  getOwnerById,
  setMasterOwner,
  getMasterOwnerId,
} = require("../db/db");
const Joi = require("joi");

// Validation schema for PATCH
const patchSchema = Joi.object({
  master: Joi.boolean().required(),
});

// GET /owners
router.get("/", async (req, res, next) => {
  try {
    const sort = req.query.sort || "name"; // name | cats
    const limit = Math.max(
      1,
      Math.min(1000, parseInt(req.query.limit || "50"))
    );
    const offset = Math.max(0, parseInt(req.query.offset || "0"));

    let owners = await getOwners();

    // Sorting
    if (sort === "name") {
      owners = owners.slice().sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "cats") {
      owners = owners
        .slice()
        .sort((a, b) => (b.cats?.length || 0) - (a.cats?.length || 0));
    }

    // Move master to top
    const masterId = await getMasterOwnerId();
    if (masterId) {
      const index = owners.findIndex((o) => o.id === masterId);
      if (index >= 0) {
        const [master] = owners.splice(index, 1);
        owners.unshift(master);
      }
    }

    const total = owners.length;
    const items = owners.slice(offset, offset + limit);

    res.json({ total, items });
  } catch (err) {
    next(err);
  }
});

// GET /owners/:id
router.get("/:id", async (req, res, next) => {
  try {
    const owner = await getOwnerById(req.params.id);

    if (!owner) return res.status(404).json({ message: "Owner not found" });

    res.json(owner);
  } catch (err) {
    next(err);
  }
});

// PATCH /owners/:id/master
router.patch("/:id/master", async (req, res, next) => {
  try {
    const { error, value } = patchSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    if (value.master === true) {
      await setMasterOwner(req.params.id);
      return res.json({ masterOwnerId: req.params.id });
    }

    const current = await getMasterOwnerId();
    if (current === req.params.id) {
      await setMasterOwner(null);
      return res.json({ masterOwnerId: null });
    }

    return res.status(400).json({ message: "Owner is not current master" });
  } catch (err) {
    if (err.message === "Owner not found")
      return res.status(404).json({ message: err.message });

    next(err);
  }
});

module.exports = router;
