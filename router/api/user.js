const Router = require('koa-router');
const router = new Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
const passport = require('koa-passport');

const User = require('../../models/User');
const code = require('../../config/stateCode');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login')

router.post('/register', async (ctx) => {
  const { username, password } = ctx.request.body;

  const { errors, isValid } = validateRegisterInput(ctx.request.body);

  if (!isValid) {
    ctx.status = 400;
    ctx.body = {
      code: code.ERROR,
      message: errors,
    };
    return;
  }

  const findOne = await User.findOne({
    username,
  });

  if (!findOne) {
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hash = await bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hash,
    });

    await newUser
      .save()
      .then((user) => {
        ctx.body = {
          code: code.SUCCESS,
          message: 'Your registration has been successful',
          data: user,
        };
      })
      .catch((err) => {
        ctx.body = {
          code: code.ERROR,
          message: 'Registration failed',
          data: { err },
        };
      });
  } else {
    ctx.status = 500;
    ctx.body = {
      code: code.ERROR,
      message: 'This username is already being used',
      data: {},
    };
  }
});

router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  const { errors, isValid } = validateLoginInput(ctx.request.body);

  if (!isValid) {
    ctx.status = 400;
    ctx.body = {
      code: code.ERROR,
      message: errors,
    };
    return;
  }

  const user = await User.findOne({ username });

  if (!user) {
    ctx.status = 404;
    ctx.body = {
      code: code.ERROR,
      message: 'This username does not exist',
      data: {},
    };
  } else {
    const verifyPassword = await bcrypt.compareSync(password, user.password);

    if (verifyPassword) {
      //return token
      const payload = { id: user.id, username: user.username };
      const token = jwt.sign(payload, keys.tokenKey, { expiresIn: '3600s' });

      ctx.status = 200;
      ctx.body = {
        code: code.SUCCESS,
        message: 'login successful',
        token: 'Bearer ' + token,
        data: { user },
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        code: code.ERROR,
        message: 'Password incorrect',
        data: {},
      };
    }
  }
});

/**
 *
 */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async (ctx) => {
    const { id, username } = ctx.state.user;
    ctx.body = { id, username };
  }
);

module.exports = router.routes();
