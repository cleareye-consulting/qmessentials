import bcrypt from 'bcryptjs'

export async function hashPassword(plainTextPassword) {
  return await bcrypt.hash(plainTextPassword, 10)
}
