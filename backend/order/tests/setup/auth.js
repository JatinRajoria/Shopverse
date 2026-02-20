const jwt = require('jsonwebtoken');

// Returns an array suitable for Supertest's .set('Cookie', ...)
// Default cookie name is 'token'; adjust if your app expects a different name.
// isme apan ko actual user id dena hoga, jisse ki wo token generate ho jaye aur authentication pass ho jaye
function getAuthCookie({ userId = '6986e3beb7ebbac2be64c362', extra = { role: "user" } } = {}) {
    const secret = process.env.JWT_SECRET || 'test-secret';
    const payload = { id: userId, ...extra };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const cookieName = process.env.JWT_COOKIE_NAME || 'token';
    return [ `${cookieName}=${token}` ];
}

module.exports = { getAuthCookie };