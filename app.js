const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')
const mongoose = require('./db/connect')

const port = 3000;

const app = new koa();
const router = new Router();

const users = require('./router/api/user');
router.use('/api/user', users);

app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
