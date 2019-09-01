import axios from 'axios'
import mysql from 'promise-mysql'
import querystring from 'querystring'

mysql
  .createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  })
  .then(con => {
    return con
      .query(
        'SELECT user_id FROM notification WHERE seen = 0 AND email = 1 AND email_sent = 0 GROUP BY user_id'
      )
      .then(result => result.map((row: { user_id: number }) => row.user_id))
      .then(users => {
        con.end()
        return processUsers(users)
      })
  })

function processUsers(users: number[]): Promise<void> {
  if (users.length === 0) return Promise.resolve()
  const [user, ...rest] = users

  return axios
    .post(
      `${process.env.SERVER_HOST}/notification/worker`,
      querystring.stringify({
        secret: process.env.JOB_SECRET,
        user: user
      }),
      {
        ...(process.env.BASIC_AUTH_USERNAME && process.env.BASIC_AUTH_PASSWORD
          ? {
              auth: {
                username: process.env.BASIC_AUTH_USERNAME,
                password: process.env.BASIC_AUTH_PASSWORD
              }
            }
          : {}),
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      }
    )
    .then(() => {
      console.log('Processed user', user)
      return wait()
    })
    .then(() => {
      return processUsers(rest)
    })
}

// Wait 1 sec
function wait(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}
