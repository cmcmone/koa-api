const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

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

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
