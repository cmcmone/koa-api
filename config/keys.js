const user = 'koaapi';
const password = 'EyKLgrgCzXd3ECSl';
const mongodbURI = `mongodb+srv://${user}:${password}@koa-api.tumcx.mongodb.net/koa-api?retryWrites=true&w=majority`;

const tokenKey = user;

module.exports = { mongodbURI, tokenKey };