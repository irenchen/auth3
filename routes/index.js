const router = require('koa-router')()
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const passport = require('koa-passport');

router.get('/', async (ctx, next) => {
  // await ctx.render('index.ejs', {
  //   title: 'Hello Koa 2!'
  // })
  if(ctx.isAuthenticated()) {
    await ctx.render('index.ejs', { user: ctx.state.user });
  } else {
    await ctx.render('login.ejs', { message: null });
  }
})

router.get('/login', async (ctx, next) => {
  await ctx.render('login.ejs', { message: null });
});

// use simple auth result redirect
router.post('/login2', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// customize auth result
router.post('/login3', async (ctx, next) => {
  var { err, user, info, status } = await auth(ctx, next);
  console.log("err = " + err);
  console.log("info = " + JSON.stringify(info));
  if(err) return await ctx.render('login.ejs', { message: err.message });
  if(!user) return await ctx.render('login.ejs', { message: info });
  await ctx.login(user);
  await ctx.render('index.ejs', { user: user });
});

async function auth(ctx, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', function(err, user, info, status) {
      resolve({ err, user, info, status });
    })(ctx, next);
  });
}

router.post('/login2', async (ctx, next) => {
  if(!ctx.request.body.username) {
    ctx.status = 400;
    ctx.body = 'username required';
  } else if(!ctx.request.body.password) {
    ctx.body = 'password required';
  }
  var result = await verifyUser(ctx.request.body.username, ctx.request.body.password);

  if(result === 'ok') {
    ctx.status = 200;
    ctx.body = jwt.sign({ username: ctx.request.body.username }, secret);
  } else {
    ctx.status = 401;
    ctx.body = result;
  }
});

async function verifyUser(username, password) {
  return new Promise((resolve, reject) => {
    User.findOne({ username: username }, (err, user) => {
      if(err) throw err;
      console.log(user);
      if(!user) {
        console.log('no user found');
        resolve('invalid user');
      } else {
        if(user.verifyPassword(password)) {
          console.log('ok');
          resolve('ok');
        } else {
          console.log('invalid pass');
          resolve('invalid user');
        }
      }
    });
  });
}

router.get('/logout', async (ctx, next) => {
  ctx.logout();
  await ctx.render('login.ejs', { message: null });
});

module.exports = router
