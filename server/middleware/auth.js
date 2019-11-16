const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  const parsedCookies = req.cookies;
  const ourCookieName = 'shortlyid';
  const reqCookieVal = parsedCookies[ourCookieName];

  if (!req.session) {
    req.session = {};
    req.session.user = {};
    req.session.hash = reqCookieVal;
  }

  const createSessionAndGetIds = function createSessionAndGetIds(callback) {
    return new Promise((resolve, reject) => {
      models.Sessions.create()
        .then(({ insertId }) => {
          models.Sessions.get({ id: insertId })
            .then((session) => {
              resolve(session);
            });
        });
    });
  };

  if (!parsedCookies || !reqCookieVal) {
    createSessionAndGetIds()
      .then(({ hash }) => {
        req.session.hash = hash;
        res.cookie(ourCookieName, hash);
        next();
      });
  } else {
    models.Sessions.get({ hash: reqCookieVal })
      .then((session) => {
        if (!session || session.hash !== reqCookieVal) {
          // invalid session
          createSessionAndGetIds()
            .then(({ hash, userId }) => {
              req.session.hash = hash;
              res.cookie(ourCookieName, hash);
              next();
            });
        } else {
          // valid session
          models.Users.get({ id: session.userId })
            .then((user) => {
              if (user) {
                req.session.user.username = user.username;
                req.session.userId = user.id;
              }
              next();
            });
        }
      })
      .catch((err) => {
        debugger;
        next();
      });
  }
};

module.exports.verifySession = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports.authenticateSession = (req, res, next) => {
  // module.Sessions.update()
  //   .then(() => {
  //     next();
  //   });
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
