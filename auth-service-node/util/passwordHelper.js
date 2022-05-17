import bcrypt from 'bcryptjs'

export async function hashPassword(plainTextPassword) {
  return bcrypt.hash(plainTextPassword, 10)
}

export async function comparePasswords(inputPlainTextPassword, storedHashedPassword) {
  const match = await bcrypt.compare(inputPlainTextPassword, storedHashedPassword)
  return match
}
