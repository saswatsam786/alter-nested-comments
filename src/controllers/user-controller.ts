import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { CustomError, createError } from "../utilities/error";
import { User, IUser } from "../models";
import { generateToken } from "../utilities/jwt-util";
import { REGISTER_VALIDATION } from "../utilities";

class UserController {
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = REGISTER_VALIDATION.validate(req.body);
      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { username, password } = <IUser>req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return next(createError(400, "User already exists with this username!"));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with username
      const newUser = new User({
        username,
        password: hashedPassword,
      });

      // Save the user to the database
      const savedUser: IUser = await newUser.save();
      const token = generateToken(savedUser._id as string);

      return res.status(201).json({ message: "User created successfully.", user: savedUser, token });
    } catch (err) {
      return next(createError((err as CustomError).status || 500, (err as Error).message));
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = REGISTER_VALIDATION.validate(req.body);
      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { username, password } = <IUser>req.body;

      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return next(createError(404, "User not found"));
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(createError(401, "Invalid credentials"));
      }

      // Generate JWT
      const token = generateToken(user._id as string);

      return res.status(200).json({ message: "User logged in successfully.", user: user, token });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };
}

export default new UserController();
