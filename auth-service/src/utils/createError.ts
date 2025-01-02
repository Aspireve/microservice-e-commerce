export const createError = (
  status: number,
  message: string
): Error & { status?: number } => {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
};
