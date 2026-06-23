/**
 * Servis katmani entegrasyon testleri icin Jest yapilandirmasi.
 * Testler gercek lokal backend'e (http://localhost:3000) istek atar.
 * RN bilesenleri import edilmedigi icin "node" ortami kullanilir.
 */
module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  testMatch: ['**/src/services/__tests__/**/*.test.ts'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
};
