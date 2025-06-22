import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    const { version, opened_connections, max_connections } =
      data.dependencies.database;
    databaseStatusInformation = (
      <>
        <p>
          <strong>Versão:</strong> {version}
        </p>
        <p>
          <strong>Conexões abertas:</strong> {opened_connections}
        </p>
        <p>
          <strong>Conexões máximas:</strong> {max_connections}
        </p>
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>
      {databaseStatusInformation}
    </>
  );
}
