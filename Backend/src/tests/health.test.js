const request = require("supertest");
const app = require("../../src/app");

describe("Health endpoint", () => {
  it("GET /api/health should return 200 and a message", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
  });
});
