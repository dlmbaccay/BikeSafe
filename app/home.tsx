import { View, ToastAndroid, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, useTheme } from 'react-native-paper';
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import SpinningWheel from "../components/spinningWheel";
import AddReport from "../components/addReport";
import ViewReport from "../components/viewReport";
import TopBar from "../components/topBar";
import { MarkerType, ReportType, LocationType, User } from "../types/interfaces";

import { LocationHelper } from "../utils/locationHelper";
import { FirestoreHelper } from "../utils/firestoreHelper";

import { NullLocation, NullUser } from "../models/nullObjects";

const Home = () => {

  const theme = useTheme();
  
  // location and map states
  const [isLoading, setLoading] = useState(true);
  const [mapRef, setMapRef] = useState<MapView | null>(null);
  const [location, setLocation] = useState<LocationType>(NullLocation);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [isNotCentered, setIsNotCentered] = useState(false);

  // animation states for AddReport component
  const [isAnimating, setIsAnimating] = useState(false);
  const slideAnimation = useRef(new Animated.Value(300)).current;

  // marker and report states
  const [markers, setMarkers] = useState<MarkerType[]>([]); 
  const [reports, setReports] = useState<ReportType[]>([]);
  
  // visibility states
  const [addReportVisible, setAddReportVisible] = useState(false);
  const [viewReportVisible, setViewReportVisible] = useState(false);

  const [user, setUser] = useState<User>(NullUser);

  useEffect(() => { 
    const initializeLocationAndFetchMarkers = async () => {
      try {
        const userLocation = await LocationHelper.getUserCurrentLocation();
        setLocation({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        FirestoreHelper.fetchMarkers(userLocation, 5, setLoading, setMarkers);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    // fetch user data from firestore
    const fetchUserData = async () => {
      if (auth().currentUser) {
        firestore().collection("users").doc(auth().currentUser?.uid).get()
        .then((doc) => {
          setUser({
            firstName: doc.data()?.firstName,
            lastName: doc.data()?.lastName,
            email: doc.data()?.email,
            avatarUrl: doc.data()?.avatarUrl,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      }
    }

    initializeLocationAndFetchMarkers();
    fetchUserData();
  }, []);

  const handleRefetchMarkers = async () => {
    try {
      setLoading(true);
      const userLocation = await LocationHelper.getUserCurrentLocation();
      FirestoreHelper.fetchMarkers(userLocation, 5, setLoading, setMarkers);
    } catch (error) {
      console.error("Error refetching markers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = (region: any) => {
    if (location) {
      const isCentered =
        Math.abs(region.latitude - location.latitude) < 0.0001 &&
        Math.abs(region.longitude - location.longitude) < 0.0001;

      setIsNotCentered(!isCentered);
    }
  };

  const handleRecenterMap = async (customLocation: LocationType | null = NullLocation) => {
    try {
      const targetLocation = customLocation || location; // Use customLocation if provided, otherwise default to user's location

      if (mapRef && targetLocation && !isAnimating) {
        setIsAnimating(true);

        // Fetch markers within 5km radius
        await FirestoreHelper.fetchMarkers(
          {
            coords: {
              latitude: targetLocation.latitude,
              longitude: targetLocation.longitude,
              altitude: 0,
              accuracy: 0,
              altitudeAccuracy: null,
              heading: 0,
              speed: 0,
            },
            timestamp: Date.now(),
          },
          5, // 5km radius
          setLoading, setMarkers
        );

        // Animate the map to the target location
        mapRef.animateToRegion(
          {
            ...targetLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000 // 1-second animation
        );

        setTimeout(() => {
          setIsNotCentered(false);
          setIsAnimating(false); // Reset after animation
        }, 1000);
      }
    } catch (error) {
      console.error("Error recentering map:", error);
    }
  };

  const handleAddReport = (e: any) => {
    const { coordinate } = e.nativeEvent;
    const selectedLocation = { ...coordinate, latitudeDelta: 0.01, longitudeDelta: 0.01 };
    setSelectedLocation(selectedLocation);
    setAddReportVisible(true);
    Animated.timing(slideAnimation, { toValue: 0, duration: 150, useNativeDriver: true }).start();
  }

  const handleViewMarkerPress = async (markerId: string) => {
    await FirestoreHelper.fetchMarkerReports(markerId, setReports);
    setViewReportVisible(true);
  }

  const handlePlaceSelected = async (location: { lat: number; lng: number }) => {
    try {
      const selectedLocation = {
        coords: {
          latitude: location.lat,
          longitude: location.lng,
          altitude: 0,
          accuracy: 0,
          altitudeAccuracy: null,
          heading: 0,
          speed: 0,
        },
        timestamp: Date.now(), // Add a timestamp field to match the LocationObject type
      };

      // Fetch markers within 5km radius of the searched location
      await FirestoreHelper.fetchMarkers(selectedLocation, 5, setLoading, setMarkers);

      // Recenter the map to the selected location
      handleRecenterMap({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error("Error handling place selection:", error);
    }
  };

  const handleSignOut = () => {
    try {
      auth().signOut().then(() => {
        ToastAndroid.show("Come back soon!", ToastAndroid.SHORT);
        router.push("sign-in");
      });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  } 

  return (
    <SafeAreaView className="h-full w-full" style={{ backgroundColor: theme.colors.background }}>
      <View className="w-full h-full flex items-center justify-center">
        {isLoading ? (  
          <SpinningWheel />
        ) : (
          <>
            { ( 
              <>
                <MapView
                  ref={(map) => setMapRef(map)}
                  className="w-full h-full"
                  initialRegion={location} 
                  showsMyLocationButton={false}
                  onRegionChangeComplete={(region) => handleRegionChange(region)}
                  showsUserLocation={true}
                  provider="google"
                  onLongPress={(e) => {
                    handleAddReport(e);
                  }}
                >
                  {markers?.map((marker) => (
                    <Marker
                      key={marker.markerId}
                      coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                      }}
                      onPress={() => handleViewMarkerPress(marker.markerId)}
                    />
                  ))}
                </MapView>

                <TopBar 
                  user={user} 
                  handlePlaceSelected={handlePlaceSelected} 
                  handleSignOut={handleSignOut} 
                />

                <FAB
                  icon="refresh"
                  onPress={handleRefetchMarkers}
                  style={{ position: 'absolute', margin: 16, right: 5, bottom: 75, backgroundColor: theme.colors.primaryContainer }}
                />

                <FAB
                  icon={`${isNotCentered ? 'navigation-variant-outline' : 'navigation-variant'}`}
                  onPress={() => handleRecenterMap(location)}
                  style={{ position: 'absolute', margin: 16, right: 5, bottom: 5, backgroundColor: theme.colors.primaryContainer }}
                />

                {addReportVisible && selectedLocation && (
                  <AddReport
                    reportVisible={addReportVisible}
                    hideReport={() => { 
                      Animated.timing(slideAnimation, { toValue: 300, duration: 150, useNativeDriver: true })
                      .start(() => setAddReportVisible(false));
                    }}
                    slideAnimation={slideAnimation}
                    latitude={selectedLocation.latitude}
                    longitude={selectedLocation.longitude}
                    setMarkers={setMarkers}
                    isNewMarker={true}
                  />
                )}

                {viewReportVisible && (
                  <ViewReport
                    reportVisible={viewReportVisible}
                    hideViewReport={() => setViewReportVisible(false)}
                    reportsData={reports}
                    setMarkers={setMarkers}
                  />
                )}
              </>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;