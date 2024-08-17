import express, { Router } from "express";
import UserController from "../controllers/user-controller";

class UserRouter {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post("/register", UserController.register);
    this.router.post("/login", UserController.login);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default UserRouter;
