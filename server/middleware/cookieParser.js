const parseCookies = (req, res, next) => {
  const { cookie } = req.headers;
  const cookieDetais = cookie.split('; ');
  const cookies = {};
  cookieDetais.map((c) => c.split('=')).forEach(([name, hash]) => {
    cookies[name] = hash;
  });
  req.cookies = cookies;
  next();
};

module.exports = parseCookies;