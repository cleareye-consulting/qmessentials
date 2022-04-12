import { hashPassword } from '../util/passwordHelper.js'
import { getMongoClient } from './mongo.js'

export async function addUser(user) {
  const [_, connection, db] = await getMongoClient()
  try {
    const users = db.collection('users')
    await users.insertOne({ ...user, password: await hashPassword(password) })
  } finally {
    connection.close()
  }
}

export async function getUser(userId) {
  const [_, connection, db] = await getMongoClient()
  try {
    const user = await db.collection('users').findOne({ userId })
    return user
  } finally {
    connection.close()
  }
}

export async function findUsersByRole(role) {
  const [_, connection, db] = await getMongoClient()
  try {
    const user = await db.collection('users').find({ roles: { $elemMatch: { $eq: { role } } } })
    return user
  } finally {
    connection.close()
  }
}

export async function bootstrapAdminUser() {
  const hasAdminUser = (await getUser(process.env.DEFAULT_ADMIN_USER)) || (await findUsersByRole('Administrator')[0]) ? true : false
  if (!hasAdminUser) {
    await addUser({
      userId: process.env.DEFAULT_ADMIN_USER,
      roles: ['Administrator'],
      givenNames: ['Default'],
      familyNames: ['Administrator'],
      password: process.env.INITIAL_ADMIN_PASSWORD,
    })
  }
}
