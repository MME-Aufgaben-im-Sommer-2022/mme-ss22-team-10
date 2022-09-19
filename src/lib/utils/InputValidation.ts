interface InputValidationResult {
  isValid: boolean;
  message?: string;
}

const DEFAULT_MIN_LENGTH = 4,
  DEFAULT_MAX_LENGTH = 20;

function validateUsername(username: string): InputValidationResult {
  if (username === "") {
    return {
      isValid: false,
      message: "Username cannot be empty",
    };
  } else if (!inputHasValidLength(username, "Username").isValid) {
    return inputHasValidLength(username, "Username");
  }
  return {
    isValid: true,
  };
}

function validateEmail(email: string): InputValidationResult {
  if (email === "") {
    return {
      isValid: false,
      message: "Email cannot be empty",
    };
  } else if (!email.includes("@")) {
    return {
      isValid: false,
      message: "Email must be a valid email",
    };
  } else if (!inputHasValidLength(email, "Email").isValid) {
    return inputHasValidLength(email, "Email");
  }
  return {
    isValid: true,
  };
}

function validateNewPasswords(
  newPassword: string,
  confirmNewPassword: string
): InputValidationResult {
  if (newPassword !== confirmNewPassword) {
    return {
      isValid: false,
      message: "Passwords do not match",
    };
  }
  if (!inputHasValidLength(newPassword, "New password").isValid) {
    return inputHasValidLength(newPassword, "New password");
  }
  return {
    isValid: true,
  };
}

function inputHasValidLength(
  input: string,
  inputName: string
): InputValidationResult {
  if (input.length < DEFAULT_MIN_LENGTH) {
    return {
      isValid: false,
      message: `${inputName} must be at least ${DEFAULT_MIN_LENGTH} characters long`,
    };
  } else if (input.length > DEFAULT_MAX_LENGTH) {
    return {
      isValid: false,
      message: `${inputName} must be at most ${DEFAULT_MAX_LENGTH} characters long`,
    };
  }
  return {
    isValid: true,
  };
}

export default InputValidationResult;
export { validateEmail, validateNewPasswords, validateUsername };
