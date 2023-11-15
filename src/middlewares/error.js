import EErrors from "../services/errors/enums.js";

export default (error, req, res, next) => {
    switch (error.code) {
        case EErrors.CART_NOT_FOUND:
            return res.status(400).json({
                status: "error",
                error: error.name,
                cause: error.cause
            });

        case EErrors.PRODUCT_NOT_FOUND:
            return res.status(400).json({
                status: "error",
                error: error.name,
                cause: error.cause
            });

        case EErrors.USER_NOT_AUTHORIZED :
            return res.status(401).json({
                status: "error",
                error: error.name,
                cause: error.cause
            });

        case EErrors.PASSWORD_NOT_VALID :
            return res.status(406).json({
                status: "error",
                error: error.name,
                cause: error.cause
            });

        default:
            return res.send({status: "error", error: "Unhandled error"})
    }
}