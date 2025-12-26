const response = (statusCode, data, message, res) => {
  res.status(statusCode).json({
    status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
    statusCode,
    message,
    data: [data],
    meta: {
      timestamp: new Date().toISOString(),
      version: "1.0",
    },
  });
};

module.exports = response;
