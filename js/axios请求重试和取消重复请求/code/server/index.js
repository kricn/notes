const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

let count = 0;

router.get('/repeat', async ctx => {
  ctx.body = {
    code: 0,
    msg: '请求成功',
  }
})

router.get('/app', async (ctx, next) => {
  count ++;
  if (count < 3) {
    throw new Error('error')
  } else {
    console.log('success')
    count = 0;
    ctx.body = {
      code: 0,
      msg: '请求成功',
      data: [
        { label: 'javascript', value: 1 },
        { label: 'c++', value: 2},
        { label: 'c', value: 3 },
        { label: 'java', value: 4},
        { label: 'php', value: 5}
      ]
    }
  }
})

app.use(router.routes())

app.listen(10086, () => {
  console.log('server is listing on 10086...')
})