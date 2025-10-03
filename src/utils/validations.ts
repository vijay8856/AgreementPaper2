export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  } else {
    // ✅ ensure no capital letters allowed
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address (lowercase only)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};


export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('Confirm password is required');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateName = (name: string, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push(`${fieldName} is required`);
  } else {
    if (name.length < 2) {
      errors.push(`${fieldName} must be at least 2 characters long`);
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      errors.push(`${fieldName} can only contain letters and spaces`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateSignupType = (signupType: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!signupType) {
    errors.push('Please select a signup type');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateSignupForm = (formData: {
  signupType: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult => {
  const errors: string[] = [];
  
  // Validate each field
  const signupTypeValidation = validateSignupType(formData.signupType);
  const firstNameValidation = validateName(formData.firstName, 'First name');
  const lastNameValidation = validateName(formData.lastName, 'Last name');
  const emailValidation = validateEmail(formData.email);
  const passwordValidation = validatePassword(formData.password);
  const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
  
  // Collect all errors
  errors.push(
    ...signupTypeValidation.errors,
    ...firstNameValidation.errors,
    ...lastNameValidation.errors,
    ...emailValidation.errors,
    ...passwordValidation.errors,
    ...confirmPasswordValidation.errors
  );
  
  return {
    isValid: errors.length === 0,
    errors
  };
};


export const GOOGLE_API_KEY='AIzaSyB_fLvruPv1k6eLHWPsJ56oSKXghLJ-lKU'