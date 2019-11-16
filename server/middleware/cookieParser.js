const parseCookies = (req, res, next) => {
  const { cookie } = req.headers;
  const cookies = {};
  if (cookie) {
    const cookieDetais = cookie.split('; ');
    cookieDetais.map((c) => c.split('=')).forEach(([name, hash]) => {
      cookies[name] = hash;
    });
  }
  req.cookies = cookies;
  next();
};

module.exports = parseCookies;