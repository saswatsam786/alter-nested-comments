import express, { Router } from "express";
import PostController from "../controllers/post-controller";
import { verifyToken } from "../middlewares/authMiddleware";

class PostRouter {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post("/", verifyToken, PostController.createPost);
    this.router.get("/:postId", verifyToken, PostController.getPostById);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default PostRouter;
