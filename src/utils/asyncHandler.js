



const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
    }
}


// Both upper and lower code functions are same. Upper code handling through promises and lower is usine async await and try catch.

/*
const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {

         await requestHandler(req, res, next)

    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })

    }
}

*/




export { asyncHandler }