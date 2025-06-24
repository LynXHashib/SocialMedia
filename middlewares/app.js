const authCheck = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      redirectTo: '/auth/user/login',
    });
  }
  if (req.session.user.verified) {
    next();
  } else {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      redirectTo: '/auth/user/login',
    });
  }
};
module.exports = { authCheck };
