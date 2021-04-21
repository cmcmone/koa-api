const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (validator.isEmpty(data.username)) {
    errors.username = 'username can not be empty';
  } else if (!validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username =
      'The length of the username must be greater than 2 and less than 30.';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'password can not be empty';
  } else if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password =
      'The length of the password must be greater than 6 and less than 30.';
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = 'password can not be empty';
  } else if (!validator.isLength(data.password2, { min: 6, max: 30 })) {
    errors.password2 =
      'The length of the password must be greater than 6 and less than 30.';
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password = 'Inconsistent passwords';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
