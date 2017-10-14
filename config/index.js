module.exports = {
  dbSettings: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/opensaturday'
  },
  httpSettings: {
    port: process.env.PORT || process.env.NODE_PORT || 3000
  }
};
