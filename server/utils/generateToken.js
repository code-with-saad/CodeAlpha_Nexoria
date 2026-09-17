import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nexoria_jwt_super_secret_key_2026', {
    expiresIn: '30d'
  });
};
