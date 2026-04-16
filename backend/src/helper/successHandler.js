// helper/successHandler.js

/**
 * Handles 200 OK success responses
 */
const handle200 = (res, data = null, message = "Success") => {
  return res.status(200).json({
    status: true,
    message,
    data
  });
};

/**
 * Handles 201 Created success responses
 */
const handle201 = (res, data = null, message = "Resource created successfully") => {
  return res.status(201).json({
    status: true,
    message,
    data
  });
};

/**
 * Handles 204 No Content success responses
 */
const handle204 =  (res, message = "Resource delete successfully") => {
  return res.status(204).json({
    status: true,
    message,
  });
};

module.exports = {
  handle200,
  handle201,
  handle204
};
