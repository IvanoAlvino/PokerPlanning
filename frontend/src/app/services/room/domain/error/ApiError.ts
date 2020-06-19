class ApiError extends Error {
  constructor(message?: string, public response?: ErrorResponse) {
    super(message);
  }
}
