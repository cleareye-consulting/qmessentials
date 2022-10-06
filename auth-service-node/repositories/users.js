import { logger } from '../app.js'
import { hashPassword } from '../util/passwordHelper.js'
import { getMongoClient } from './mongo.js'

export async function addUser(user) {
  const [_, connection, db] = await getMongoClient()
  try {
    const users = db.collection('users')
    await users.insertOne({ ...user, password: await hashPassword(user.password) })
  } finally {
    connection.close()
  }
}

export async function updateUser(userId, user) {
  const [_, connection, db] = await getMongoClient()
  try {
    const users = db.collection('users')
    const existing = users.findOne({ userId })
    const password = existing.password
    await users.replaceOne({ userId }, { ...user, password })
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
    const users = await db.collection('users').find({ roles: { $elemMatch: { $eq: role } } })
    return users
  } finally {
    connection.close()
  }
}

export async function bootstrapAdminUser() {
  const hasAdminUser = (await getUser(process.env.DEFAULT_ADMIN_USER)) || (await findUsersByRole('Administrator')[0]) ? true : false
  if (!hasAdminUser) {
    logger.warn(`Bootstrapping admin user with initial password`)
    await addUser({
      userId: process.env.DEFAULT_ADMIN_USER,
      roles: ['Administrator'],
      givenNames: ['Default'],
      familyNames: ['Administrator'],
      password: process.env.INITIAL_ADMIN_PASSWORD,
    })
  }
}

export async function bootstrapServiceAccounts() {
  const [_, connection, db] = await getMongoClient()
  try {
    const allUsers = await db.collection('users').find({}).toArray()
    for (let service of ['Auth', 'Observation', 'Configuration', 'Subscription']) {
      let exists = false
      for (let user of allUsers) {
        if (user.roles.length === 1 && user.roles[0] === `${service} Service`) {
          exists = true
          break
        }
      }
      if (!exists) {
        logger.warn(`Bootstrapping user ${service} Service with initial password`)
        await addUser({
          userId: `${service.toUpperCase()}-SVC`,
          roles: [`${service} Service`],
          givenNames: [service],
          familyNames: ['Service'],
          password: process.env.INITIAL_ADMIN_PASSWORD,
        })
      }
    }
  } finally {
    connection.close()
  }
}
