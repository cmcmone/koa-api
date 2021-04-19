const Router = require('koa-router');
const router = new Router();

const User = require('../../models/User');

router.get('/test', (ctx) => {
  ctx.body = {
    msg: 'hello world!',
  };
});

router.post('/register', async (ctx) => {
  const { username, password } = ctx.request.body;

  const findOne = await User.findOne({
    username: username,
  });

  if (!findOne) {
    const newUser = new User({
      username,
      password,
    });
    await newUser
      .save()
      .then((user) => {
        ctx.body = user;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    ctx.status = 500;
    ctx.body = {
      msg: 'username already exist',
    };
  }

  console.log(findOne);
});

module.exports = router.routes();
