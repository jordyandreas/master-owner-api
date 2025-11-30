// src/__tests__/owners.test.js
const request = require("supertest");
const app = require("../app"); // <-- fixed path
const dbModule = require("../db/db"); // <-- fixed path

beforeAll(async () => {
  await dbModule.init();
});

describe("Owners API (lowdb)", () => {
  test("GET /owners returns items and total", async () => {
    const res = await request(app).get("/owners");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toHaveProperty("total");
  });

  test("GET /owners?sort=cats sorts correctly", async () => {
    const res = await request(app).get("/owners?sort=cats");
    expect(res.status).toBe(200);
    const items = res.body.items;
    for (let i = 1; i < items.length; i++) {
      expect(
        (items[i - 1].cats?.length || 0) >= (items[i].cats?.length || 0)
      ).toBe(true);
    }
  });

  test("PATCH /owners/:id/master sets master owner", async () => {
    const list = await request(app).get("/owners");
    const lastOwner = list.body.items[list.body.items.length - 1];
    const id = lastOwner.id;

    const setRes = await request(app)
      .patch(`/owners/${id}/master`)
      .send({ master: true });

    expect(setRes.status).toBe(200);
    expect(setRes.body.masterOwnerId).toBe(id);

    const after = await request(app).get("/owners");
    expect(after.body.items[0].id).toBe(id);
  });

  test("PATCH with invalid payload returns 400", async () => {
    const list = await request(app).get("/owners");
    const id = list.body.items[0].id;

    const res = await request(app)
      .patch(`/owners/${id}/master`)
      .send({ wrong: "value" });

    expect(res.status).toBe(400);
  });
});
