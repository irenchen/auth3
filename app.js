const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const flash = require('koa-connect-flash')

const index = require('./routes/index')
const users = require('./routes/users')

// initial database connection
require('./config/db.js');

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))


app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))
app.keys = ['secret']
app.use(session({}, app))
app.use(flash())

// passport authentication
const passport = require('koa-passport')
require('./config/auth.js')(passport)
app.use(passport.initialize())
app.use(passport.session())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const koaJWT = require('koa-jwt');

// routes need not JWT authentication
app.use(index.routes(), index.allowedMethods())
app.use(isLoggedIn)
app.use(users.routes(), users.allowedMethods())
// use koa-jwt to verify jwt token
var secret = require('./config/secret');
app.use(koaJWT({ secret: secret }).unless({ path: [/^\/login/] }));

// routes need JWT authentication
// app.use(users.routes(), users.allowedMethods())

module.exports = app


// route middleware to make sure a user is logged in 
async function isLoggedIn(ctx, next) {
  if(ctx.isAuthenticated()) {
    return next();
  } else {
    await ctx.redirect('/login', { message: null });
  }
}
