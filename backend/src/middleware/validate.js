export function validate(schema) {
  return (request, response, next) => {
    const result = schema.safeParse({ body: request.body, params: request.params, query: request.query });
    if (!result.success) {
      return response.status(400).json({
        error: {
          message: "Invalid request",
          details: result.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
        },
      });
    }
    request.validated = result.data;
    next();
  };
}

