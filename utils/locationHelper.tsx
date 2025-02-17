import * as Location from 'expo-location';

export class LocationHelper {
  
  public static async getUserCurrentLocation(): Promise<Location.LocationObject> {
    return await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  }

  public static getBoundingBox(latitude: number, longitude: number, radius: number) {
    const earthRadius = 6378;
    const lat = latitude * (Math.PI / 180);
    const lon = longitude * (Math.PI / 180);
    const dLat = radius / earthRadius;
    const dLon = Math.asin(Math.sin(dLat) / Math.cos(lat));

    const minLat = lat - dLat;
    const maxLat = lat + dLat;
    const minLng = lon - dLon;
    const maxLng = lon + dLon;

    return {
      minLat: minLat * (180 / Math.PI),
      maxLat: maxLat * (180 / Math.PI),
      minLng: minLng * (180 / Math.PI),
      maxLng: maxLng * (180 / Math.PI),
    };
  }

  private static haversineCache = new Map<string, number>();

  public static memoizedHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const key = `${lat1},${lon1}-${lat2},${lon2}`;
    if (this.haversineCache.has(key)) return this.haversineCache.get(key)!;

    const R = 6378;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    this.haversineCache.set(key, distance);
    return distance;
  }

}