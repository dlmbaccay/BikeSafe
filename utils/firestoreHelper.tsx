import firestore from "@react-native-firebase/firestore";
import { LocationHelper } from "./locationHelper";
import * as Location from 'expo-location';


export class FirestoreHelper {

  public static async fetchMarkers (userLocation: Location.LocationObject, radius: number, setLoading: any, setMarkers: any) {
    try {
    const { latitude, longitude } = userLocation.coords;
      const dateNow = new Date();
      const twentyFourHoursAgo = new Date(dateNow.getTime() - 24 * 60 * 60 * 1000);

      const bounds = LocationHelper.getBoundingBox(latitude, longitude, radius)

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
        const distance = LocationHelper.memoizedHaversine(
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
  

  public static async getUserData(uid: string) {
    const userProfileDoc = await firestore().collection("users").doc(uid).get();
    const userProfile = userProfileDoc.data();
    return userProfile;
  }

  public static async setMarker(latitude: number, longitude: number) {
    const markerRef = firestore().collection("markers").doc();
    await markerRef.set({
      markerId: markerRef.id,
      latitude,
      longitude,
      lastCreatedReportAt: firestore.FieldValue.serverTimestamp(),
    });
    return markerRef;
  }
  
  public static async setReport(report: any) {
    const reportRef = firestore().collection("reports").doc();
    await reportRef.set(report);
    return reportRef;
  }

  

  // Shuan Changes

  // Andre Changes
  public static async updateMarkerReportDate(markerId?: string) {
    if (!markerId) {
        console.log("No marker id provided.")
        return
    }
    // update the marker on the last report created
    await firestore().collection("markers").doc(markerId).update({
        lastCreatedReportAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  public static async deleteMarker(markerId: string) {
    await firestore().collection("markers").doc(markerId).delete();
  }

  public static async updateReport( reportId: string, updatedData: object) {
    await firestore().collection("reports").doc(reportId).update(updatedData);
  }

  public static async deleteReport(userId:string, reportId: string) {
    await firestore().collection("reports").doc(reportId).delete();
    await firestore().collection("users").doc(userId).collection("reports").doc(reportId).delete();
  }

  public static async checkSingleReportMarker(markerId:string) {
    const reports = await firestore()
        .collection("reports")
        .where("markerId", "==", markerId).limit(2)
        .get();

    if (reports.docs.length != 1) {
        return false
    }
    return true
  }

  public static async updateReportsUnderUser(userId: string, reportId: string) {
    await firestore().collection("users").doc(userId).update({
        reports: firestore.FieldValue.arrayUnion(reportId),
      });
  }

  public static async removeImageUrlFromReport( reportId: string) {
    await firestore().collection("reports").doc(reportId).update({
        imageUrl: null, // Update the Firestore record to remove the image URL
      });
  }

  public static async updateUser( userId: string, updatedData: object) {
    await firestore().collection("users").doc(userId).update(updatedData);
  }
}
