const GeneralError = {
    InvalidError: "Invalid error!",
    NotFound: "User not found!",
    WrongPassword: "Wrong password!",
    SamePassword: "New password is old password, please type another password.",
    NotALikePassword: "Password and confirm password is not match, please type password or confirm password again.",
    VerifyAccountError: "Can't create account, please try again.",
    EmailSentError: "Can't send verification email, please try again."
};

const GeneralMessage = {
    ChangePasswordSuccess: "Change password successful.",
    EmailSent: "Email sent, please check your email."
}

module.exports = { GeneralError, GeneralMessage };

