import ApiError from '../ApiError';
import authService from '../services/auth.service';
import userService from '../services/user.service';

export default function authRoute (router) {
  router.route('/auth/login')
    .post(async (req, res, next) => {
      const { email, password } = req.body;
      if (!email || !password) {
        res.locals.error = new ApiError(ApiError.REQUIRED_FIELDS_MISSING);
        next();
        return;
      }

      const user = await userService.getUser(email);
      if (user === null) {
        res.locals.error = new ApiError(ApiError.UNAUTHORIZED);
        next();
        return;
      }

      const valid = await authService.verifyPassword(password, user.passwordHash);
      if (!valid) {
        res.locals.error = new ApiError(ApiError.UNAUTHORIZED);
        next();
        return;
      }

      res.locals.data = {
        authToken: await authService.createAuthToken(user.email),
        ...user._doc,
      };
      next();
      return;
    });

  router.route('/auth/verify')
    .post(async (req, res, next) => {
      const { authToken } = req.body;
      if (authToken) {
        const data = await authService.verifyAuthToken(authToken);
        if (data === null) {
          res.locals.error = new ApiError(ApiError.UNAUTHORIZED);
        } else {
          res.locals.data = true;
        }
        next();
        return;
      }

      res.locals.error = new ApiError(ApiError.REQUIRED_FIELDS_MISSING);
      next();
      return;
    });

  return router;
}
