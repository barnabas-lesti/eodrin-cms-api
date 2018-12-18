const { assert, expect } = require('chai');

const ApiError = require('../../src/ApiError');
const database = require('../../src/database');
const userService = require('../../src/services/userService');

describe('UserService', () => {
  const existingEmail = 'test@mail.com';

  before(async () => {
    await database.connect();
    await database.clearCollection(userService.getModel());
  });

  after(async () => {
    await database.clearCollection(userService.getModel());
    await database.disconnect();
  });

  describe('createUser', () => {
    it('should save a new user to the database and return a promise with the '
			+ 'created user if the provided user object was valid', async () => {
      const validUserToCreate = {
        email: existingEmail,
        password: 'test1234',
      };
      const createdUser = await userService.createUser(validUserToCreate);
      assert.isObject(createdUser);
    });
    it('should throw an error with type REQUIRED_FIELDS_MISSING if the provided '
			+ 'user object has missing required properties', async () => {
      const userWithFieldsMissing = {
        email: 'noPassword@mail.com',
      };
      let user = null;
      let fieldsMissingError;
      try {
        user = await userService.createUser(userWithFieldsMissing);
      } catch (error) {
        fieldsMissingError = error;
      }
      assert.isNull(user);
      assert.isDefined(fieldsMissingError);
      expect(fieldsMissingError.type).to.equal(ApiError.REQUIRED_FIELDS_MISSING);
    });
    it('should throw an error with type IDENTIFIER_TAKEN if the provided '
			+ 'users email is already taken', async () => {
      const userWithAlreadyTakenEmail = {
        email: existingEmail,
        password: 'test1234',
      };
      let user = null;
      let idTakenError;
      try {
        user = await userService.createUser(userWithAlreadyTakenEmail);
      } catch (error) {
        idTakenError = error;
      }
      assert.isNull(user);
      assert.isDefined(idTakenError);
      expect(idTakenError.type).to.equal(ApiError.IDENTIFIER_TAKEN);
    });
  });

  describe('getUser', () => {
    it('should return a promise with the user if found', async () => {
      const existingUserEmail = existingEmail;
      let user;
      let anErrorThatShouldNotBeHere = null;
      try {
        user = await userService.getUser(existingUserEmail);
      } catch (error) {
        anErrorThatShouldNotBeHere = error;
      }
      assert.isNull(anErrorThatShouldNotBeHere);
      assert.isDefined(user);
      expect(user.email).to.equal(existingUserEmail);
    });
    it('should return a promise with null if user was not found', async () => {
      const nonExistingUserEmail = 'firstTimeHere@mail.com';
      let user;
      let anErrorThatShouldNotBeHere = null;
      try {
        user = await userService.getUser(nonExistingUserEmail);
      } catch (error) {
        anErrorThatShouldNotBeHere = error;
      }
      assert.isNull(anErrorThatShouldNotBeHere);
      assert.isNull(user);
    });
  });

  describe('updateUser', () => {
    it('should update a user and return a promise with the user if the update '
			+ 'is valid', async () => {
      const email = existingEmail;
      const update = {
        password: 'updatedPassword',
      };
      let updatedUser;
      let anErrorThatShouldNotBeHere = null;
      try {
        updatedUser = await userService.updateUser(email, update);
      } catch (error) {
        anErrorThatShouldNotBeHere = error;
      }
      assert.isNull(anErrorThatShouldNotBeHere);
      assert.isDefined(updatedUser);
      expect(updatedUser.password).to.equal(update.password);
    });
    it('should not update readonly fields like the email', async () => {
      const email = existingEmail;
      const update = {
        email: 'notTheOriginalEmail@mail.com',
        password: 'updatedPassword',
      };
      let updatedUser;
      let anErrorThatShouldNotBeHere = null;
      try {
        updatedUser = await userService.updateUser(email, update);
      } catch (error) {
        anErrorThatShouldNotBeHere = error;
      }
      assert.isNull(anErrorThatShouldNotBeHere);
      assert.isDefined(updatedUser);
      expect(updatedUser.email).to.equal(email);
    });
    it('should return a promise with null if user was not found', async () => {
      const nonExistingUserEmail = 'firstTimeHere@mail.com';
      let success;
      let anErrorThatShouldNotBeHere = null;
      try {
        success = await userService.updateUser(nonExistingUserEmail, {});
      } catch (error) {
        anErrorThatShouldNotBeHere = error;
      }
      assert.isNull(anErrorThatShouldNotBeHere);
      assert.isNull(success);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return a promise with boolean true', async () => {
      const existingUserEmail = existingEmail;
      let success;
      let anErrorThatShouldNotBeHere = null;
      try {
        success = await userService.deleteUser(existingUserEmail);
      } catch (error) {
        anErrorThatShouldNotBeHere = error;
      }
      assert.isNull(anErrorThatShouldNotBeHere);
      assert.isDefined(success);
      expect(success).to.equal(true);
    });
    it('should return a promise with null if user was not found', async () => {
      const nonExistingUserEmail = 'firstTimeHere@mail.com';
      let success;
      let anErrorThatShouldNotBeHere = null;
      try {
        success = await userService.deleteUser(nonExistingUserEmail);
      } catch (error) {
        anErrorThatShouldNotBeHere = error;
      }
      assert.isNull(anErrorThatShouldNotBeHere);
      assert.isNull(success);
    });
  });
});
