import userService from '../services/user.service';

export default function usersRoute (router) {
  router.route('/users')
    .post(async (req, res, next) => {
      try {
        res.locals.data = await userService.createUser(req.body);
      } catch (error) {
        res.locals.error = error;
      }
      next();
    })
    .get(async (req, res, next) => {
      try {
        res.locals.data = await userService.getUsers();
      } catch (error) {
        res.locals.error = error;
      }
      next();
    });

  router.route('/users/:email')
    .get(async (req, res, next) => {
      try {
        res.locals.data = await userService.getUser(req.params.email);
      } catch (error) {
        res.locals.error = error;
      }
      next();
    })
    .patch(async (req, res, next) => {
      try {
        res.locals.data = await userService.updateUser(req.params.email, req.body);
      } catch (error) {
        res.locals.error = error;
      }
      next();
    })
    .delete(async (req, res, next) => {
      try {
        res.locals.data = await userService.deleteUser(req.params.email);
      } catch (error) {
        res.locals.error = error;
      }
      next();
    });

  return router;
}
