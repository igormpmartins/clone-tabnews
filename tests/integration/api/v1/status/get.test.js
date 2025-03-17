test("get  to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log("responseBody!", responseBody);

  expect(responseBody.updated_at).toBeDefined();

  const maxConnections = responseBody.dependencies.database.max_connections;
  const openedConnections =
    responseBody.dependencies.database.opened_connections;
  const dbVersion = responseBody.dependencies.database.version;

  expect(maxConnections).toBeDefined();
  expect(openedConnections).toBeDefined();
  expect(dbVersion).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(maxConnections).toBeGreaterThan(0);
  expect(openedConnections).toBeGreaterThan(0);
  expect(dbVersion).not.toBe("");
});

test.only("test SQL Injection", async () => {
  const response = await fetch(
    "http://localhost:3000/api/v1/status?databaseName=local_db'",
  );

  const responseBody = await response.json();
  console.log("responseBody!", responseBody);
});
