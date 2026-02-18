// This setup file configures an in-memory MongoDB instance for testing purposes, ensuring that tests run in isolation without affecting the actual database. It also sets a test JWT secret for authentication-related tests.
// ye ram me ek temporary MongoDB instance create karta hai, jise hum apne tests ke liye use karenge. ye ensure karta hai ki hamare tests isolated environment me run ho, aur hamare actual database ko affect na kare. isme ham ek test JWT secret bhi set karte hai, jise authentication related tests ke liye use kiya jayega.
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;

// beforeAll, afterEach, and afterAll are Jest lifecycle hooks that run before all tests, after each test, and after all tests, respectively. We use these hooks to set up our in-memory MongoDB instance, clean up the database between tests, and close the connection after all tests are done.
// beforeAll mtlb ye function sabhi tests ke run hone se pehle execute hoga, afterEach mtlb ye function har test ke baad execute hoga, aur afterAll mtlb ye function sabhi tests ke run hone ke baad execute hoga. hum in hooks ka use apne in-memory MongoDB instance ko set up karne ke liye, tests ke beech me database ko clean up karne ke liye, aur sabhi tests ke baad connection ko close karne ke liye karte hai.
beforeAll(async () => {
    // Start in-memory MongoDB
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    process.env.MONGO_URI = uri; // ensure app's db connector uses this
    process.env.JWT_SECRET = "test_jwt_secret"; // set a test JWT secret

    await mongoose.connect(uri);
});

afterEach(async () => {
    // Cleanup all collections between tests
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        // Empty object ka matlab hai ki hum collection ke sare documents ko delete karna chahte hai, lekin collection khud ko delete nahi karna chahte.
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    if (mongo) await mongo.stop();
});

// beforeAll: Server start karo + Connect karo.

// afterEach: Data saaf karo.

// afterAll: Connecton band karo + Server stop karo.