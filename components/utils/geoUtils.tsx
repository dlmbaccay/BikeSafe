export const memoizedHaversine = (() => {
    const cache = new Map();
    return (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const key = `${lat1},${lon1}-${lat2},${lon2}`;
      if (cache.has(key)) return cache.get(key);
  
      const R = 6371; // Earth's radius in kilometers
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
  
      cache.set(key, distance);
      return distance;
    };
  })();
  
  export function getBoundingBox(latitude: number, longitude: number, radius: number) {
    const earthRadius = 6371;
    const lat = latitude * (Math.PI / 180);
    const lon = longitude * (Math.PI / 180);
    const dLat = radius / earthRadius;
    const dLon = Math.asin(Math.sin(dLat) / Math.cos(lat));
  
    return {
      minLat: (lat - dLat) * (180 / Math.PI),
      maxLat: (lat + dLat) * (180 / Math.PI),
      minLng: (lon - dLon) * (180 / Math.PI),
      maxLng: (lon + dLon) * (180 / Math.PI),
    };
  }
  