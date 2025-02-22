export const handleError = (res, error, message = "An error occurred") => {
  const response = {
    status: "error",
    message,
  };
  return res.status(500).json(response);
};

export const handleNotFound = (res, message) => {
  return res.status(404).json({ message });
};

export const handleForbidden = (res, message) => {
  return res.status(403).json({ message });
};

export const handleSuccess = (res, message, data, status = 200) => {
  const response = {
    status: "success",
    message,
    data,
  };
  return res.status(status).json(response);
};

export const handleBadRequest = (res, message) => {
  return res.status(400).json({ message });
};
