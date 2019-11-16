const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  const parsedCookies = req.cookies;
  const ourCookieName = 'shortlyid';
  const reqCookieVal = parsedCookies[ourCookieName];

  // if (!reqCookieVal) {
  //   models.Sessions.create()
  // } else {
  //   models.Sessions.get({hash: reqCookieVal})
  //     .then((session) => {

  //     })
  //     .catch((err) => {

  //     });
  // }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

