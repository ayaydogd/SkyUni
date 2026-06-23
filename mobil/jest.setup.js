/**
 * Test ortami: servisler localhost:3000'deki backend'e baglanir.
 * (Uygulama icinde DEV adresi 10.0.2.2 iken, host uzerinde kosan testler
 *  localhost kullanir.)
 */
process.env.EXPO_PUBLIC_API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
