var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const fgaClient = require('./openFga');

function renderResponse(res, allowed, action){
  allowed ? res.render('allowed', { action }) :   res.render('unauthorized', { action })
}

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});


router.get('/readDoc', requiresAuth(), async function (req, res, next) {
  try{
    const {allowed} = await fgaClient.checkUserAccess(
      `user:${req.oidc.user.email}`,
      "can_read",
      "doc:A"
      );
      renderResponse(res, allowed, "Read Document")
  }catch(err){
    console.error(err)
  } 
});

router.get('/editDoc', requiresAuth(), async function (req, res, next) {
  try{
    const {allowed} = await fgaClient.checkUserAccess(
      `user:${req.oidc.user.email}`,
      "can_write",
      "doc:A"
      );
      renderResponse(res, allowed, "Edit Document")
  }catch(err){
    console.error(err)
  } 
});

router.get('/deleteDoc', requiresAuth(), async function (req, res, next) {
  try{
    const {allowed} = await fgaClient.checkUserAccess(
      `user:${req.oidc.user.email}`,
      "owner",
      "doc:A"
      );
      renderResponse(res, allowed, "Delete Document")
  }catch(err){
    console.error(err)
  } 
});

router.get('/viewFolder', requiresAuth(), async function (req, res, next) {
  try{
    const {allowed} = await fgaClient.checkUserAccess(
      `user:${req.oidc.user.email}`,
      "viewer",
      "folder:A"
      );
      renderResponse(res, allowed, "View Folder")
  }catch(err){
    console.error(err)
  } 
});

router.get('/deleteFolder', requiresAuth(), async function (req, res, next) {
  try{
    const {allowed} = await fgaClient.checkUserAccess(
      `user:${req.oidc.user.email}`,
      "owner",
      "folder:A"
      );
      renderResponse(res, allowed, "Delete folder")
  }catch(err){
    console.error(err)
  } 
});

module.exports = router;
