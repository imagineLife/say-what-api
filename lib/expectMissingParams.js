function expectMissingParams(response) {
  expect(response.status).toBe(422);
  expect(JSON.stringify(response.body)).toBe(JSON.stringify({ Error: 'missing required params' }));
}

module.exports = {
  expectMissingParams
}