const successResponse = (data, message = null, meta = null) => {
  const response = {
    success: true,
    data
  };

  if (message) {
    response.message = message;
  }

  if (meta) {
    response.meta = meta;
  }

  return response;
};

const errorResponse = (code, message, details = null, path = '') => {
  const response = {
    success: false,
    error: {
      code,
      message
    },
    timestamp: new Date().toISOString(),
    path
  };

  if (details) {
    response.error.details = details;
  }

  return response;
};

const paginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginationMeta
};