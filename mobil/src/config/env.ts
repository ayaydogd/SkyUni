/**
 * Tek config noktasi — DEV / PROD ortam yonetimi.
 *
 * Oncelik sirasi:
 *  1. process.env.EXPO_PUBLIC_API_URL  (test/CI veya manuel override)
 *  2. APP_ENV bayragina gore secilen sabit URL
 *
 * Android emulatorde host makinenin localhost'u "10.0.2.2" olarak gorulur,
 * bu yuzden DEV adresi 10.0.2.2'dir (web'deki localhost karsiligi).
 */

export type AppEnv = 'dev' | 'prod';

// APK uretiminde 'prod' yapilacak. Gelistirme/emulator testinde 'dev'.
export const APP_ENV: AppEnv =
  (process.env.EXPO_PUBLIC_APP_ENV as AppEnv) || 'dev';

const URLS: Record<AppEnv, string> = {
  // Android emulator -> host makine backend (node server.js, port 3000)
  dev: 'http://10.0.2.2:3000',
  // Canli sistem (Render).
  prod: 'https://skyuni.onrender.com',
};

/** Aktif API kok adresi. */
export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL || URLS[APP_ENV];

export const IS_DEV = APP_ENV === 'dev';

/**
 * Yalnizca DEV modunda login formunu otomatik dolduran demo hesap.
 * PROD (APK) modunda bos doner; gercek kullanicilar kendi bilgilerini girer.
 */
export const DEV_CREDENTIALS = IS_DEV
  ? { email: 'ogr.demo@test.edu.tr', password: 'Demo12345' }
  : { email: '', password: '' };
