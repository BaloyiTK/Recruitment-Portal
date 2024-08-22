import Log from "../models/log.js";


const logRequestResponse = async (req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    const responseTime = Date.now() - start;

    const logEntry = new Log({
      level: 'info',
      message: `Request to ${req.method} ${req.url}`,
      details: {
        request: {
          url: req.originalUrl,
          method: req.method,
          queryParams: req.query,
          headers: req.headers,
          body: req.body,
        },
        response: {
          statusCode: res.statusCode,
          responseTime: responseTime,
          body: res.locals.body, // Assume you save response body in res.locals.body
        },
        user: {
          userId: req.user?._id, // Assuming you have user authentication
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
    } catch (err) {
      console.error('Failed to save log:', err);
    }
  });

  next();
};

export default logRequestResponse;
