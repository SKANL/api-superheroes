import jwt from 'jsonwebtoken';

export class JWTService {
  static sign(payload) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verify(token) {
    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  }
}
