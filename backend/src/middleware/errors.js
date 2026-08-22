export function notFound(request, response) {
  response.status(404).json({ error: { message: `Route not found: ${request.method} ${request.originalUrl}` } });
}

export function errorHandler(error, _request, response, _next) {
  if (error?.code === "LIMIT_FILE_SIZE") {
    return response.status(413).json({ error: { message: "Image must be smaller than 5 MB" } });
  }
  if (error?.name === "CastError") {
    return response.status(400).json({ error: { message: "Invalid identifier" } });
  }
  if (error?.name === "ValidationError") {
    return response.status(400).json({ error: { message: "Validation failed", details: error.message } });
  }
  if (error?.code === 11000) {
    return response.status(409).json({ error: { message: "A record with this identifier already exists" } });
  }
  console.error(error);
  response.status(error.status || 500).json({ error: { message: error.message || "Internal server error" } });
}
