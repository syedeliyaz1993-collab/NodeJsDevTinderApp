const validator = require('validator');

const validateSignUpData = (req) => {

    const { firstName, lastName, emailId, password, age, gender, skills } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name and last name are required");
    } else if (firstName.length < 3 || firstName.length > 30) {
        throw new Error("First name must be between 3 and 30 characters");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email address");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol");
    }

    //validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }))
};

const validateProfileEditData = (req, res) => {

    const allowedEditFields = ["firstName", "lastName", "emailId", "skills", "age", "gender"];

    const isEditAllowed = Object.keys(req.body).every(f => allowedEditFields.includes(f));

    return isEditAllowed;
}

const validateForgotPassword = (req, res) => {
    const isAllowedField = ["emailId", "password"];
    const isEditAllowed = Object.keys(req.body).every(f => isAllowedField.includes(f));

    return isEditAllowed;
}

module.exports = { validateSignUpData, validateProfileEditData, validateForgotPassword };