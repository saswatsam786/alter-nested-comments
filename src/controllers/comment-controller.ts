import { NextFunction, Request, Response } from "express";
import { Post, Comment } from "../models/";
import {
  CREATE_COMMENT_VALIDATION,
  PARAMS_COMMENT_VALIDATION,
  REPLY_COMMENT_PARAMS_VALIDATION,
} from "../utilities/validations/comment-validation";
import { createError, CustomError } from "../utilities/error";

export interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

class CommentController {
  public createComment = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      // Validate the request body
      const { error: bodyError } = CREATE_COMMENT_VALIDATION.validate(req.body);
      if (bodyError) {
        return next(createError(400, bodyError.details[0].message));
      }

      const { postId } = req.params;

      // Validate the parameters
      const { error: paramsError } = PARAMS_COMMENT_VALIDATION.validate({ postId });
      if (paramsError) {
        return next(createError(400, paramsError.details[0].message));
      }

      const { text } = req.body;
      const userId = req.user?.id;

      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return next(createError(404, "Post not found"));
      }

      // Create a new comment
      const comment = new Comment({ postId, userId, text });
      await comment.save();

      return res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };

  public replyToComment = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { error } = REPLY_COMMENT_PARAMS_VALIDATION.validate(req.params);

      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { error: bodyError } = CREATE_COMMENT_VALIDATION.validate(req.body);

      if (bodyError) {
        return next(createError(400, bodyError.details[0].message));
      }

      const { postId, commentId } = req.params;

      const { text } = req.body;
      const userId = req.user?.id;

      const post = await Post.findById(postId);
      if (!post) {
        return next(createError(404, "Post not found"));
      }

      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        return next(createError(404, "Comment not found"));
      }

      const comment = new Comment({ postId, userId, text, parentCommentId: commentId });
      await comment.save();

      return res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };

  public getCommentsForPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = PARAMS_COMMENT_VALIDATION.validate(req.params);
      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { postId } = req.params;
      const { sortBy = "createdAt", sortOrder = "asc" } = req.query;

      // Type narrowing: Make sure sortBy and sortOrder are strings
      const sortByStr = typeof sortBy === "string" ? sortBy : "createdAt";
      const sortOrderStr = sortOrder === "desc" || sortOrder === "asc" ? sortOrder : "asc";

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comments = await Comment.find({ postId, parentCommentId: null })
        .sort({ [sortByStr]: sortOrderStr }) // Use the narrowed types
        .populate("replies")
        .exec();

      const formattedComments = comments.map((comment) => ({
        id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        postId: comment.postId,
        parentCommentId: comment.parentCommentId,
        replies: comment.replies.slice(0, 2),
        totalReplies: comment.replies.length,
      }));

      return res.status(200).json({ message: "Comments fetched successfully", comments: formattedComments });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };

  public expandParentComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = REPLY_COMMENT_PARAMS_VALIDATION.validate(req.params);

      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { postId, commentId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const post = await Post.findById(postId);
      if (!post) {
        return next(createError(404, "Post not found"));
      }

      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const comments = await Comment.find({ postId, parentCommentId: commentId })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate("replies")
        .exec();

      const formattedComments = comments.map((comment) => ({
        id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        postId: comment.postId,
        parentCommentId: comment.parentCommentId,
        replies: comment.replies.slice(0, 2),
        totalReplies: comment.replies.length,
      }));

      return res.status(200).json({ message: "Comments fetched successfully", comments: formattedComments });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };
}

export default new CommentController();
