const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  const parsedCookies = req.cookies;
  const ourCookieName = 'shortlyid';
  const reqCookieVal = parsedCookies[ourCookieName];

  if (!req.session) {
    req.session = {};
  }

  if (!parsedCookies || !reqCookieVal) {
    models.Sessions.create()
      .then(({ insertId }) => {
        models.Sessions.get({id: insertId})
          .then(({ hash }) => {
            res.cookie(ourCookieName, hash);
            req.session.hash = hash;
            next();
          })
          .catch((err) =>{
            console.log(err);
          });
      })
      .catch((err) =>{
        console.log(err);
      });
  } else {
    models.Sessions.get({ hash: reqCookieVal })
      .then((session) => {
        //if(session[0])
        next();
      })
      .catch((err) => {
        next();
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

// if (!req.session) {
//   req.session = {};
//   req.session.user = {};
// }
// if (req.cookies) {
//   models.Sessions.get({ hash: req.cookies.shortlyid }).then(results => {
//     req.session.user.username = results.user.username;
//     req.session.userId = results.userId;
//   }).catch(err => console.log(err));
// }
// console.log(req.session);
// models.Sessions.create()
//   .then(session => {
//     return models.Sessions.get({ id: session.insertId }
//     )
//       .then(data => {
//         req.session.hash = data.hash;
//         if (!res.cookies.shortlyid) {
//           res.cookies.shortlyid = {};
//           res.cookies.shortlyid.value = data.hash;
//         }
//       })
//       .then(() => {
//         next();
//       });
//   });
