import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.PG_DATABASE_URL
})

export default pool