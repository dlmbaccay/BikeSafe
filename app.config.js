import "dotenv/config";

const appConfig = {
  expo: {
    name: "mobdeve-mco",
    slug: "mobdeve-mco",
    scheme: "mobdeve-mco",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/bike-logo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      googleServicesFile: "GoogleService-Info.plist",
      supportsTablet: true,
      bundleIdentifier: "com.garynation.mobdeve",
    },
    android: {
      googleServicesFile: "./google-services.json",
      package: "com.garynation.mobdeve",
      adaptiveIcon: {
        foregroundImage: "./assets/images/bike-logo.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/images/bike-logo.png",
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    plugins: [
      "expo-router",
      "@react-native-firebase/app",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location.",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "a66f38cd-4ef0-43e4-bc0b-0cd672cd1e5c",
      },
    },
  },
};

module.exports = appConfig;