process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://localhost:27017/test-db-skip-real';
process.env.JWT_SECRET = process.env.JWT_SECRET || '0190d2520f832848860659c10e80c166a55975634517b92405bc6e478a23ead0';
process.env.JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'token';