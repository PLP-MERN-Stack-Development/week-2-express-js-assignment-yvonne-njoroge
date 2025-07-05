const mongoose = require("mongoose");

const userTokenSchema = new Schema({
  userId: {
    type: Schema.Type.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 86400,
  },
});

module.exports = mongoose.model('UserToken', userTokenSchema);

