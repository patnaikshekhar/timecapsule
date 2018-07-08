const redis = require("redis")
const {promisify} = require('util')
const client = redis.createClient(process.env.REDIS_URL || 'redis://localhost')
const get = promisify(client.get).bind(client)
const set = promisify(client.set).bind(client)
const del = promisify(client.del).bind(client)
const uuid = require('uuid')

const CACHE_EXPIRY = 60 * 5

const createSession = async (res, username) => {
  const sessionId = uuid()
  await set(sessionId, username, 'EX', CACHE_EXPIRY)
  res.cookie('TIMECAPSULE-SESSIONID', sessionId)
}

module.exports = {
  get,
  set,
  del,
  client,
  createSession
}