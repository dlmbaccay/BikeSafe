import firestore from "@react-native-firebase/firestore";
import { GeoHelper } from "./geoHelper";
import * as Location from 'expo-location';


export class FirestoreHelper {

  public static async fetchMarkers (userLocation: Location.LocationObject, radius: number, setLoading: any, setMarkers: any) {
    try {
    const { latitude, longitude } = userLocation.coords;
      const dateNow = new Date();
      const twentyFourHoursAgo = new Date(dateNow.getTime() - 24 * 60 * 60 * 1000);

      const bounds = GeoHelper.getBoundingBox(latitude, longitude, radius)

      // fetch markers created within the last 24 hours
      const snapshot = await firestore()
        .collection("markers")
        .where('latitude', '>=', bounds.minLat)
        .where('latitude', '<=', bounds.maxLat)
        .where('longitude', '>=', bounds.minLng)
        .where('longitude', '<=', bounds.maxLng) 
        .where("lastCreatedReportAt", ">=", twentyFourHoursAgo)
        .get();

      const fetchedMarkers = snapshot.docs.map(doc => ({
        markerId: doc.id,
        latitude: doc.data().latitude,
        longitude: doc.data().longitude,
        lastCreatedReportAt: doc.data().lastCreatedReportAt,
      }));

      // filter markers within the radius using haversine formula
      const filteredMarkers = fetchedMarkers.filter((marker) => {
        const distance = GeoHelper.memoizedHaversine(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          marker.latitude,
          marker.longitude
        );
        return distance <= radius;
      });

      // store filtered markers in state
      setMarkers(filteredMarkers);
    } catch (error) {
      console.error("Error fetching markers:", error);
    } finally {
      setLoading(false);
    }
  };

  public static async fetchMarkerReports(markerId: string, setReports: any) {
    try {
      const dateNow = new Date();
      const twentyFourHoursAgo = new Date(dateNow.getTime() - 24 * 60 * 60 * 1000);

      // fetch reports created within the last 24 hours for the marker
      const snapshot = await firestore()
        .collection("reports")
        .where("markerId", "==", markerId)
        .where("createdAt", ">=", twentyFourHoursAgo)
        .get();

      const fetchedReports = snapshot.docs.map(doc => ({
        markerId: doc.data().markerId,
        reportId: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        latitude: doc.data().latitude,
        longitude: doc.data().longitude,
        createdAt: doc.data().createdAt,
        userId: doc.data().userId,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        imageUrl: doc.data().imageUrl,
      }));

      setReports(fetchedReports);
    } catch (error) {
      console.error("Error fetching reports: ", error);
    }
  };
  
}
