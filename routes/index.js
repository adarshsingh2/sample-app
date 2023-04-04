var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const AuthzUtil = require('./authorize');

function getAccessToken(headers) {
  return (headers['x-forwarded-access-token'] || headers['X-Forwarded-Access-Token'])
}

function setUserContext(req, res){
  const accessToken = getAccessToken(req.headers);
  if (accessToken) {
    res.locals.user = AuthzUtil.getTokenPayload(accessToken);
  }
}

function isAuthorized(role) {
  return (req, res, next) => {
    const accessToken = getAccessToken(req.headers);
    if (accessToken) {
      res.locals.user = AuthzUtil.getTokenPayload(accessToken);
      res.locals.isAuthenticated = true;
    }
    const isAuthorizedUser = AuthzUtil.checkUserRole(accessToken, role);
    isAuthorizedUser ? next() : renderResponse(res, false, role)
  }
}

function renderResponse(res, allowed, action) {
  allowed ? res.render('allowed', { action }) : res.render('unauthorized', { action })
}

router.get('/', function (req, res, next) {
  setUserContext(req, res);
  res.render('index', {
    title: 'Webapp sample Nodejs',
    isAuthenticated: !!getAccessToken(req.headers)
  });
});

router.get('/home', function (req, res, next) {
  setUserContext(req, res);
  res.render('index', {
    title: 'Webapp sample Nodejs',
    isAuthenticated: !! getAccessToken(req.headers)
  });
});

router.get('/profile', function (req, res, next) {
  let user = AuthzUtil.getTokenPayload(getAccessToken(req.headers));
  res.render('profile', {
    userProfile: JSON.stringify(user, null, 2),
    user,
    isAuthenticated:true,
    title: 'Profile page'
  });
});

router.get('/api/admin', isAuthorized('admin'), async function (req, res, next) {
  renderResponse(res, true, "admin")
});

router.get('/api/member', isAuthorized('member'), async function (req, res, next) {
  renderResponse(res, true, "member")
});

router.get('/api/guest', isAuthorized('guest'), async function (req, res, next) {
  renderResponse(res, true, "guest")
});


module.exports = router;
