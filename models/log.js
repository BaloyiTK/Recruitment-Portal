import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  url: { type: String },
  method: { type: String },
  queryParams: { type: mongoose.Schema.Types.Mixed },
  headers: { type: mongoose.Schema.Types.Mixed },
  body: { type: mongoose.Schema.Types.Mixed },
});

const responseSchema = new mongoose.Schema({
  statusCode: { type: Number, min: 100, max: 599 },
  responseTime: { type: Number },
  body: { type: mongoose.Schema.Types.Mixed },
});

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  username: { type: String },
  role: { type: String },
});

const errorSchema = new mongoose.Schema({
  message: { type: String },
  code: { type: String },
  stack: { type: String },
  functionName: { type: String },
});

const serverSchema = new mongoose.Schema({
  hostname: { type: String },
  environment: { type: String },
  appVersion: { type: String },
});

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  level: { type: String, required: true, enum: ['info', 'warn', 'error'] },
  message: { type: String, required: true, maxlength: 1000 },
  details: {
    request: requestSchema,
    response: responseSchema,
    user: userSchema,
    error: errorSchema,
    server: serverSchema
  }
});

// Indexes
logSchema.index({ timestamp: -1 });
logSchema.index({ level: 1 });

// TTL Index
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

const Log = mongoose.models.Log || mongoose.model('Log', logSchema);

export default Log;
