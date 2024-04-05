export const isAuthorized = (...roles) => {
  return async (req, res, next) => {
    // check user role
    if (!roles.includes(req.user.role))
      return next(new Error("user is not authorize", { cause: 403 }));

    return next();
  };
};
