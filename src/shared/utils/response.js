// Helper para respuestas estándar
export const success = (res, data) =>
  res.status(200).json({ success: true, data });
export const error = (res, error, status = 500) =>
  res.status(status).json({ success: false, error });
