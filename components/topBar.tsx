import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Card, Searchbar, Avatar, useTheme, List, Divider, ActivityIndicator, Chip } from 'react-native-paper';
import { router } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants  from "expo-constants";
import { User } from "../types/interfaces";

interface TopBarProps {
  user: User;
  handlePlaceSelected: (location: { lat: number, lng: number }) => void;
  handleSignOut: () => void;
}

const TopBar = ({ user, handlePlaceSelected, handleSignOut }: TopBarProps) => {
  const [showHelper, setShowHelper] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCardOpen, setCardOpen] = useState(false);
  const theme = useTheme();

  // TODO: Add a search functionality

  return (
    <View className={`absolute top-0 w-[90%]`}>
      <Card className={`h-fit mt-6 mb-4 p-2 rounded-3xl ${isCardOpen ? 'pb-0' : ''}`} style={{ backgroundColor: theme.colors.primaryContainer }}>
        <Card.Content className="flex w-full items-center justify-between p-0 m-0">
          <View className="flex flex-row">
            {/* <Searchbar
              placeholder="Search"
              className="w-[86%] h-[50px]"
              inputStyle={{ fontSize: 14, paddingBottom: 6 }}
              onChangeText={(query) => setSearchQuery(query)}
              value={searchQuery}
              style={{ backgroundColor: theme.colors.primaryContainer }}
            /> */}

            <GooglePlacesAutocomplete
              placeholder="Search"
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (details?.geometry?.location) {
                  handlePlaceSelected(details.geometry.location);
                }
              }}
              query={{
                key: Constants.expoConfig?.extra?.eas.googlePlacesApiKey,
                language: 'en'
              }}
              listViewDisplayed="auto"
              onFail={(err) => {
                console.error(err)
              }}
              styles={{
                textInputContainer: {
                  backgroundColor: theme.colors.primaryContainer,
                  borderRadius: 10,
                  marginBottom: 0,
                  flex: 1,
                },
                textInput: {
                  backgroundColor: theme.colors.background,
                  fontSize: 14,
                },
                listView: {
                  backgroundColor: theme.colors.primaryContainer,
                  zIndex: 10, // Ensure it's above other components
                },
              }}
            />
            
            { user.avatarUrl ? (
              <TouchableOpacity onPress={() => setCardOpen(!isCardOpen)}> 
                <Avatar.Image
                  size={50}
                  className="w-fit h-fit"
                  source={{ uri: user?.avatarUrl }}
                />
              </TouchableOpacity>
            ) : <ActivityIndicator animating={true} color={theme.colors.primary} size={50} /> }
          </View>

          { isCardOpen && (
            <List.Section className="w-full">
              <List.Item title="Manage Account" titleStyle={{ fontSize: 14 }} left={() => <List.Icon icon="account" />} className="px-4" onPress={() => router.push("user-profile")} />
              <Divider className="w-full" style={{ backgroundColor: theme.colors.outline }}/>
              <List.Item title="Sign Out"  titleStyle={{ fontSize: 14 }} left={() => <List.Icon icon="exit-to-app" />} className="px-4" onPress={handleSignOut} />
            </List.Section>
          )}
        </Card.Content>
      </Card>

      { showHelper && (
        <Chip
          icon="information"
          closeIcon="close"
          onClose={() => setShowHelper(false)}
          className="rounded-3xl w-fit"
          mode="outlined"
          textStyle={{ fontSize: 12 }}
          >Long press on the map to report a condition!</Chip>
      )}
    </View>
  );
};

export default TopBar;