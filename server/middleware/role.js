// backend/middleware/role.js
module.exports = function (roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ msg: 'User does not have the necessary permissions' });
      }
      next();
    };
  };
  