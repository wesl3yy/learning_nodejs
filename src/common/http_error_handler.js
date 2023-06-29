import { GeneralError, GeneralMessage } from "./general";

class HttpError extends Error {
    /**
     * @param {string} message 
     * @param {number} __httpStatusCode 
     */
    constructor(message, __httpStatusCode) {
        super(message);
    }

    HttpStatusCode() {
        return this.__httpStatusCode;
    }
}

const commonErrors = new Set([
    ...Object.values(GeneralError),
    ...Object.values(GeneralMessage),
]);

export function HttpErrorHandler(err, req, res, next) {
    if (commonErrors.has(err)) {
        err = new HttpError(err.message, 400);
    }
    if (err && typeof err.HttpStatusCode === "function") {
        const message = err.message;
        res.status(err.HttpStatusCode() || 400).json({
            error: message,
        });
        return;
    }
    console.log(err);
    res.status(500).send({
        error: "internal server error",
    });
}
