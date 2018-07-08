const { Pool } = require('pg')
const { parse } = require('pg-connection-string')

const pool = new Pool(
  parse(process.env.DATABASE_URL || 'postgres://localhost:5432/timecapsule')
)

async function connect() {
  return await pool.connect()
}

async function checkLogin(username, password) {

  let err 

  try {
    const client = await connect()
    const result = await client.query(`SELECT ID, EMAIL, PASSWORD FROM USERS WHERE EMAIL = '${username}'`)

    if (result) {
      if (result.rows) {
        if (result.rows[0]) {
          if (result.rows[0].password == password) {
            client.release()
            return [null, result.rows[0].id, result.rows[0].email]
          } else {
            err = 'Password does not match'
          }
        } else {
          err = 'Username not found'
        }
      } else {
        err = 'Username not found'
      }
    } else {
      err = 'Username not found'
    }
  } catch(e) {
    err = e.toString()
  }
  
  client.release()
  return [err, null]
}

async function createUser(username, password, name) {
  const client = await connect()
  let err = null
  const result = await client.query(`SELECT ID, EMAIL FROM USERS WHERE EMAIL = '${username}'`)

  if (result) {
    if (result.rows[0]) {
      err = "User already exists"
    } else {
      await client.query(`INSERT INTO USERS (EMAIL, PASSWORD, NAME) VALUES ('${username}', '${password}', '${name}')`)
    }
  }

  client.release()
  return err
}

module.exports = {
  connect,
  checkLogin,
  createUser
}
