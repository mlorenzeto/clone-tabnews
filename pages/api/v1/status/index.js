import database from "infra/database";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const { query } = database;
    // Recupera a versão do Postgres
    const databaseVersionResult = await query("SHOW server_version;");
    const databaseVersionValue = databaseVersionResult.rows[0].server_version;

    // Recupera o total de conexões disponíveis
    const databaseMaxConnectionsResult = await query("SHOW max_connections;");
    const databaseMaxConnectionsValue = parseInt(
      databaseMaxConnectionsResult.rows[0].max_connections,
    );

    // Recupera as conexões abertas
    const databaseName = process.env.POSTGRES_DB;
    const databaseOpenedConnectionsResult = await query({
      text: "SELECT count(*)::int total_connections FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });
    const databaseOpenedConnectionsValue =
      databaseOpenedConnectionsResult.rows[0].total_connections;
    const updatedAt = new Date().toISOString();
    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersionValue,
          max_connections: databaseMaxConnectionsValue,
          opened_connections: databaseOpenedConnectionsValue,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.log("\n Erro dentro do catch do controller:");
    console.error(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}

export default status;
