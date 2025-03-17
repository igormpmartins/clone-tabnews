import database from "infra/database.js";

async function status(req, res) {
  const query =
    "SELECT current_setting('max_connections') as max_connections, current_setting('server_version') as server_version;";

  //Alternative commands
  //const query = "SELECT version();"
  //const query = "SHOW server_version;"
  //const query = "SHOW max_connections;"
  //" (SELECT sum(numbackends) FROM pg_stat_database) as opened_connections";

  const result = await database.query(query);
  const max_connections = parseInt(result.rows[0].max_connections);
  const version = result.rows[0].server_version;

  const dbName = process.env.POSTGRES_DB;

  const result2 = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [dbName],
  });

  const opened_connections = parseInt(result2.rows[0].count);

  const updatedAt = new Date().toISOString();

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: max_connections,
        opened_connections: opened_connections,
        version: version,
      },
    },
  });
}

export default status;
