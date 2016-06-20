var koa = require('koa')
  , app = koa()



// append view renderer
var views = require('koa-render')
app.use(views('./views', {
  map: { html: 'handlebars' },
  cache: false
}))

// public routes
var Router = require('koa-router')

var public = new Router()

public.get('/', function*() {
  this.body = yield this.render('login')
})


// POST /login
public.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
)

public.get('/logout', function*(next) {
  this.logout()
  this.redirect('/')
})

public.get('/auth/facebook',
  passport.authenticate('facebook')
)

public.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
)

public.get('/auth/twitter',
  passport.authenticate('twitter')
)

public.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
)

public.get('/auth/google',
  passport.authenticate('google')
)

public.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
)

app.use(public.middleware())

// Require authentication for now
app.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next
  } else {
    this.redirect('/')
  }
})

var secured = new Router()

secured.get('/app', function*() {
  this.body = yield this.render('app')
})

app.use(secured.middleware())

// start server
app.listen(process.env.PORT || 3000)
