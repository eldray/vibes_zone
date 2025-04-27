module.exports = {
  sendResponse: (res, status, message, data = null, error = null) => {
    const response = { success: status < 400, message };
    if (data) response.data = data;
    if (error) response.error = error;
    res.status(status).json(response);
  },
};
