
// this is the code which we are going to use lots of time in controllers so we wrap this code into a function 
const asyncHandler = (fun) => async(req, res, next) => {
    try {
        await fun(req, res, next)
    } catch(error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

export default asyncHandler;