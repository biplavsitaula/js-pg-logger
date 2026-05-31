import { Pool } from "pg";

class Logger {
  constructor() {
    this.pool = null;
    this.tableName = "api_logs";
    this.initialized = false;
    this.allowedFields = new Set();
  }

  async init(dbUrl, options = {}) {
    if (this.initialized) return;

    this.pool = new Pool({
      connectionString: dbUrl,
    });

    const fields = options || {};

    // store allowed fields for safety later
    this.allowedFields = new Set(Object.keys(fields));

    const columnsSQL = Object.entries(fields)
      .map(([key, type]) => `${key} ${type}`)
      .join(", ");

    const query = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW()
        ${columnsSQL ? "," + columnsSQL : ""}
      );
    `;

    await this.pool.query(query);

    this.initialized = true;

    console.log("Logger initialized");
  }

  async save(logData) {
    if (!this.initialized) {
      throw new Error("Logger not initialized. Call logger.init() first.");
    }

    const keys = Object.keys(logData);

    // optional safety check (recommended)
    for (const key of keys) {
      if (!this.allowedFields.has(key)) {
        throw new Error(`Field "${key}" is not defined in table schema`);
      }
    }

    const columns = keys.join(", ");
    const values = Object.values(logData);

    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO ${this.tableName} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.pool.query(query, values);

    return result.rows[0];
  }
  // -------------------------
  // GET ALL LOGS
  // -------------------------
  async getAll(limit = 50, offset = 0) {
    const query = `
      SELECT *
      FROM ${this.tableName}
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await this.pool.query(query, [limit, offset]);
    return result.rows;
  }

  // -------------------------
  // GET BY ID
  // -------------------------
  async getById(id) {
    const query = `
      SELECT *
      FROM ${this.tableName}
      WHERE id = $1
      LIMIT 1
    `;

    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }
}

export const logger = new Logger();

//EXAMPLE USAGE

// import { logger } from "your-logger-package";

// await logger.init(process.env.DB_URL, {
//     user_id: "TEXT",
//     action: "TEXT",
//     route: "TEXT",
//     method: "TEXT",
// });

// ENDS HERE
