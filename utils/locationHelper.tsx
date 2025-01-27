import * as Location from 'expo-location';

export class LocationHelper {
  
  public static async getUserCurrentLocation(): Promise<Location.LocationObject> {
    return await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  }
  
}
