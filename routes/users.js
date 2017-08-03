const router = require('koa-router')()
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');

router.prefix('/users')

router.get('/', function (ctx, next) {
  // var token = ctx.request.header.authorization.slice(7);
  // var [ header, payload, signature ] = token.split('.');
  // var decoded = jwt.verify(token, secret);
  // console.log(decoded);

  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router

// route middleware to make sure a user is logged in 
async function isLoggedIn(ctx, next) {
  if(ctx.isAuthenticated()) {
    return next();
  } else {
    await ctx.redirect('/login');
  }
}

