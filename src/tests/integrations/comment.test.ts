import request from "supertest";
import App from "../../app";

describe("Comment API", () => {
  let token: string;
  let postId: string;
  const appInstance = new App();
  const app = appInstance.get_app();

  beforeEach(async () => {
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "password123" });

    token = userRes.body.token;

    const postRes = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "My First Post", content: "This is the content of my first post" });

    postId = postRes.body._id;
  });

  it("should create a new comment", async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "This is a comment" });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("text", "This is a comment");
  });

  it("should reply to a comment", async () => {
    const commentRes = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "This is a comment" });

    const commentId = commentRes.body._id;

    const replyRes = await request(app)
      .post(`/api/posts/${postId}/comments/${commentId}/reply`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "This is a reply" });

    expect(replyRes.statusCode).toEqual(201);
    expect(replyRes.body).toHaveProperty("text", "This is a reply");
  });

  it("should retrieve comments for a post", async () => {
    await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "This is a comment" });

    const res = await request(app).get(`/api/posts/${postId}/comments`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should expand a comment and retrieve its replies", async () => {
    const commentRes = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "This is a comment" });

    const commentId = commentRes.body._id;

    await request(app)
      .post(`/api/posts/${postId}/comments/${commentId}/reply`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "This is a reply" });

    const res = await request(app).get(`/api/posts/${postId}/comments/${commentId}/expand`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
