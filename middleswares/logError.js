import Log from "../models/log.js";


const logError = async (err, req, res, next) => {
  const logEntry = new Log({
    level: 'error',
    message: `Error occurred in ${req.method} ${req.url}`,
    details: {
      request: {
        url: req.originalUrl,
        method: req.method,
        queryParams: req.query,
        headers: req.headers,
        body: req.body,
      },
      error: {
        message: err.message,
        code: err.code,
        stack: err.stack,
        functionName: err.functionName || 'Unknown',
      },
      user: {
        userId: req.user?._id,
        username: req.user?.username,
        role: req.user?.role,
      },
      server: {
        hostname: req.hostname,
        environment: process.env.NODE_ENV,
        appVersion: process.env.APP_VERSION,
      }
    }
  });

  try {
    await logEntry.save();
  } catch (saveErr) {
    console.error('Failed to save error log:', saveErr);
  }

  res.status(err.status || 500).json({ error: err.message });
};

export default logError;
