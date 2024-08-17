import express, { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import CommentController from "../controllers/comment-controller";
import { commentRateLimiter } from "../middlewares/rateLimiterMiddleware";

class CommentRouter {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post("/:postId/comments", verifyToken, commentRateLimiter, CommentController.createComment);
    this.router.post(
      "/:postId/comments/:commentId/reply",
      verifyToken,
      commentRateLimiter,
      CommentController.replyToComment
    );
    this.router.get("/:postId/comments", CommentController.getCommentsForPost);
    this.router.get("/:postId/comments/:commentId/expand", verifyToken, CommentController.expandParentComments);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default CommentRouter;
