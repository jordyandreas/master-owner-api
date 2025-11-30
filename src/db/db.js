// src/db/db.js
const { join } = require("path");
const { randomUUID } = require("crypto");
const fs = require("fs").promises;
const fsSync = require("fs");

const filePath = join(__dirname, "data.json");

function generateId() {
  return randomUUID();
}

async function readDb() {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return { owners: [], masterOwnerId: null };
    throw err;
  }
}

async function writeDb(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function makeSeed() {
  return {
    owners: [
      {
        id: generateId(),
        name: "Alice R.",
        phone: "081234567890",
        cats: [
          { id: generateId(), name: "Mittens", age: 2 },
          { id: generateId(), name: "Whiskers", age: 4 },
        ],
      },
      {
        id: generateId(),
        name: "Bob K.",
        phone: "081299988777",
        cats: [{ id: generateId(), name: "Tiger", age: 1 }],
      },
      {
        id: generateId(),
        name: "Charlie L.",
        phone: "081211122233",
        cats: [],
      },
    ],
    masterOwnerId: null,
  };
}

async function init() {
  // During tests we want deterministic fresh DB every run
  const isTest =
    process.env.NODE_ENV === "test" ||
    typeof process.env.JEST_WORKER_ID !== "undefined";

  if (isTest) {
    // overwrite with fresh seed
    const seed = makeSeed();
    await writeDb(seed);
    return;
  }

  // Non-test behavior: create file if missing and seed only if empty
  if (!fsSync.existsSync(filePath)) {
    const seed = makeSeed();
    await writeDb(seed);
    return;
  }

  const current = await readDb();
  if (!current || !Array.isArray(current.owners)) {
    await writeDb(makeSeed());
  }
}

async function getOwners() {
  const db = await readDb();
  return db.owners || [];
}

async function getOwnerById(id) {
  const db = await readDb();
  return (db.owners || []).find((o) => o.id === id) || null;
}

async function setMasterOwner(id) {
  const db = await readDb();

  if (id === null) {
    db.masterOwnerId = null;
  } else {
    const exists = (db.owners || []).some((o) => o.id === id);
    if (!exists) throw new Error("Owner not found");
    db.masterOwnerId = id;
  }

  await writeDb(db);
  return db.masterOwnerId;
}

async function getMasterOwnerId() {
  const db = await readDb();
  return db.masterOwnerId || null;
}

module.exports = {
  init,
  getOwners,
  getOwnerById,
  setMasterOwner,
  getMasterOwnerId,
  filePath,
};
