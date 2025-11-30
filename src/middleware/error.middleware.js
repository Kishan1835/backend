const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
        statusCode: err.statusCode || 500,
    });
};

export default errorHandler;
