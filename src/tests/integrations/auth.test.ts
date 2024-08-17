import request from "supertest";
import App from "../../app";

describe("Auth API", () => {
  const appInstance = new App();
  const app = appInstance.get_app();

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({ username: "testuser", password: "password123" });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login an existing user", async () => {
    await request(app).post("/api/auth/register").send({ username: "testuser", password: "password123" });

    const res = await request(app).post("/api/auth/login").send({ username: "testuser", password: "password123" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail to login with incorrect password", async () => {
    await request(app).post("/api/auth/register").send({ username: "testuser", password: "password123" });

    const res = await request(app).post("/api/auth/login").send({ username: "testuser", password: "wrongpassword" });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });
});
