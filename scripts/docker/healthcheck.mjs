// Catalogue readiness only: this endpoint does not make provider requests.
try {
  const response = await fetch('http://127.0.0.1:3000/api/catalog/options', {
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error('Catalogue unavailable');
  const body = await response.json();
  if (!body.context?.catalogVersion || !Array.isArray(body.options?.cities) || !body.options.cities.length) {
    throw new Error('Invalid catalogue response');
  }
} catch {
  console.error('Catalogue readiness check failed.');
  process.exitCode = 1;
}
