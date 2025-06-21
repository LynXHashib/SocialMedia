const authCheck = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/user/login');
  }
  if (req.session.user.verified) {
    next();
  } else {
    return res.redirect('/auth/user/login');
  }
};
module.exports = { authCheck };
