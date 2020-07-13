const isEmpty = (string) => {
  //if string is defined:
  if (string) {
    //if its whitespace, it is empty
    if (!string.trim()) {
      return true;
      //if its not whitespace, it is not empty
    } else {
      return false;
    }
  } else {
    //if string is undefined:
    return true;
  }
};

const isEmail = (string) => {
  // eslint-disable-next-line no-control-regex
  let regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return string.match(regex);
};

export default function (string, type, signup) {
  if (type === 'email') {
    if (isEmpty(string)) {
      return 'Email must not be empty';
    }
    if (!isEmail(string)) {
      return 'Invalid email';
    }
  } else if (type === 'password') {
    if (isEmpty(string)) {
      return 'Password must not be empty';
    }
  } else if (type === 'confirmPassword') {
    if (isEmpty(string)) {
      return 'Confirm password must not be empty';
    }
  }

  //check length only for sign up sheets
  else if (signup) {
    if (string.length > 30) {
      return 'Password is too long';
    }
    if (string.length < 6) {
      return 'Password is too short';
    }
  } else {
    return null;
  }
}
