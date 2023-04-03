var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const checkUserRole = require('./authorize');

function getAccessToken(headers) {
  return (headers['x-forwarded-access-token'] || headers['X-Forwarded-Access-Token'])
}


function isAuthorized(role) {
  return (req, res, next) => {
    const accessToken = getAccessToken(req.headers);
    const isAuthorizedUser = checkUserRole(accessToken, role);
    isAuthorizedUser ? next() : renderResponse(res, false, role)
  }
}

function renderResponse(res, allowed, action) {
  allowed ? res.render('allowed', { action }) : res.render('unauthorized', { action })
}

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Webapp sample Nodejs',
    isAuthenticated: !!getAccessToken(req.headers)
  });
});

router.get('/home', function (req, res, next) {
  res.render('index', {
    title: 'Webapp sample Nodejs',
    isAuthenticated: !!getAccessToken(req.headers)
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
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
