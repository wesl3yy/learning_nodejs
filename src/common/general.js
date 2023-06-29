const GeneralError = {
    InvalidError: new Error("Invalid error!"),
    NotFound: new Error("User not found!"),
    UserExisted: new Error("User existed"),
    WrongPassword: new Error("Wrong password!"),
    SamePassword: new Error("New password is old password, please type another password."),
    NotALikePassword: new Error("Password and confirm password is not match, please type password or confirm password again."),
    VerifyAccountError: new Error("Can't create account, please try again."),
    EmailSentError: new Error("Can't send verification email, please try again.")
};

const GeneralMessage = {
    ChangePasswordSuccess: new Error("Change password successful."),
    EmailSent: new Error("Email sent, please check your email.")
}

export { GeneralError, GeneralMessage };

