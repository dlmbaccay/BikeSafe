// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_MAPS_API_KEY: string;
    GOOGLE_PLACES_API_KEY: string;
  }
}