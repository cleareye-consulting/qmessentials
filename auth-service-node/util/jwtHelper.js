import jwt from 'jsonwebtoken'

export function getToken(userId) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '18h' })
  return token
}

export function verifyToken(token) {
  const parsed = jwt.verify(token, process.env.JWT_SECRET)
  return parsed
}
