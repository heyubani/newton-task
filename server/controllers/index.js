import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import env from 'dotenv';
import User from '../models/user';
import {
  uuid
} from 'uuidv4';
import * as Enums from '../libs/enum.status';
env.config();


export const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password.trim(), 10);
    const registeredUser = await User.findOne({
      username: req.body.username.trim()
    });

    if (registeredUser) {
      return res.status(Enums.HTTP_CONFLICT).json({
        status: 'error',
        message: 'Username already exists.',
      });
    }

    const user = await User.create({
      user_id: `user-${uuid()}`,
      username: req.body.username.trim(),
      password: hashedPassword,
    });

    return res.status(Enums.HTTP_CREATED).json({
      status: 'success',
      message: 'Successfully create account with Newton',
      data: user,
    });
  } catch (error) {
    return res.status(Enums.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    const comparePassword = bcrypt.compareSync(req.body.password, req.user.password);

    if (!comparePassword && !user) {
      return res.status(Enums.UNPROCESSABLE_ENTITY).json({
        status: 'Failed',
        message: 'Invalid Username or Password',
      });
    }

    const token = jwt.sign({ username: req.user.username },
      process.env.SECRET_KEY, {
        expiresIn: '1h'
      }); // Expires in 1 hours

    return res.status(Enums.SUCCESS).json({
      status: 'Success',
      message: 'Successfully logged in',
      data: {
        user_id: user.user_id,
        username: user.username,
        token,
      },
    });
  } catch (err) {
    return res.status(Enums.INTERNAL_SERVER_ERROR).json({
      status: 'Failed',
      message: `Error signing in user: ${err.message}`,
    });
  }
};

export const homePage = async (req, res) => {
  return res.status(Enums.SUCCESS).json({
    status: 'Success',
    message: `Welcome to your dashboard, ${req.user.username}`
  });
}