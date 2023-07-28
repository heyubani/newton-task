import express from 'express';
import * as Controller from  '../controllers';
import Model from '../middlewares/models';
import Schema from '../libs/schemas';
import * as Middleware from  '../middlewares';


const router = express.Router();

router.get('/', (req, res) => res.send({
    message: 'Welcome to Jite Newton Task'
  }));

  router.post(
    '/auth/signup',
    Model(Schema.userSchema, 'payload'),
    Middleware.getUser('validate'),
    Controller.signup
  );

  router.post(
    '/auth/signin',
    Model(Schema.userSchema, 'payload'),
    Middleware.getUser('login'),
    Controller.signIn
  );
  
  router.get(
    '/user/',
     Middleware.validateAuthToken,
     Controller.homePage
    );

export default router;