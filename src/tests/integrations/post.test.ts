import request from "supertest";
import App from "../../app";

describe("Post API", () => {
  let token: string;
  const appInstance = new App();
  const app = appInstance.get_app();

  beforeEach(async () => {
    const res = await request(app).post("/api/auth/register").send({ username: "testuser", password: "password123" });

    token = res.body.token;
  });

  it("should create a new post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "My First Post", content: "This is the content of my first post" });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("title", "My First Post");
  });

  it("should retrieve a post by ID", async () => {
    const createRes = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "My First Post", content: "This is the content of my first post" });

    const postId = createRes.body._id;

    const getRes = await request(app).get(`/api/posts/${postId}`);

    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body).toHaveProperty("title", "My First Post");
  });

  it("should return 404 for a non-existent post", async () => {
    const res = await request(app).get("/api/posts/invalidPostId123");

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Post not found");
  });
});
