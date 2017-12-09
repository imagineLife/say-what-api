exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      // 'mongodb://localhost/speechs';
                      'mongodb://speechUser:Speech8User6@ds119476.mlab.com:19476/speechs';
exports.TEST_DATABASE_URL = 'mongodb://localhost/speechs-test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '5m';