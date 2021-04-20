const Router = require('koa-router');
const router = new Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../../models/User');
const code = require('../../config/stateCode');

router.post('/register', async (ctx) => {
  const { username, password } = ctx.request.body;

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
  const user = await User.findOne({ username });

  console.log(user);

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

      ctx.status = 200;
      ctx.body = {
        code: code.SUCCESS,
        message: 'login successful',
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

module.exports = router.routes();
