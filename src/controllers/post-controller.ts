import { NextFunction, Request, Response } from "express";
import { IPost, Post } from "../models";
import { CREATE_POST_VALIDATION, GET_POST_VALIDATION } from "../utilities";
import { createError, CustomError } from "../utilities/error";

export interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

class PostController {
  public createPost = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error } = CREATE_POST_VALIDATION.validate(req.body);

      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { title, content } = <IPost>req.body;
      const userId = req.user?.id;

      const post = new Post({ title, content, userId });
      await post.save();

      res.status(201).json({ message: "Post created successfully", post });
    } catch (err) {
      return next(createError((err as CustomError).status || 500, (err as Error).message));
    }
  };

  public getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error } = GET_POST_VALIDATION.validate(req.params);

      if (error) {
        return next(createError(400, error.details[0].message));
      }
      const { postId } = req.params;

      const post = await Post.findById(postId);

      if (!post) {
        return next(createError(404, "Post not found"));
      }

      res.status(200).json({ message: "Post fetched successfully", post });
    } catch (err) {
      return next(createError((err as CustomError).status || 500, (err as Error).message));
    }
  };
}

export default new PostController();
