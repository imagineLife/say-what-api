exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      // 'mongodb://localhost/speechs';
                      'mongodb://speechUser:Speech8User6@ds119476.mlab.com:19476/speechs';
exports.PORT = process.env.PORT || 8080;