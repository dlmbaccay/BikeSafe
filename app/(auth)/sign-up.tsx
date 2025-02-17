import { View, ScrollView, Image, TouchableOpacity, Alert, useColorScheme } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput, Text, useTheme, HelperText } from "react-native-paper";
import { router } from "expo-router";
import bikeLogoLight from "../../assets/images/bike-logo-light.png";
import bikeLogoDark from "../../assets/images/bike-logo-dark.png";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { AuthenticationService } from "../../utils/authServiceHelper";

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPaswordVisible, setConfirmPasswordVisible] = useState(false);
  
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const bikeLogo = colorScheme === "light" ? bikeLogoLight : bikeLogoDark;


  const passwordErrors = () => {
    return form.password.length < 6 ? "Password must be at least 6 characters" : "";
  }

  const confirmPasswordErrors = () => {
    return form.password !== form.confirmPassword ? "Passwords do not match" : "";
  }

  return (
    <SafeAreaView className="h-full w-full" style={{ backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ alignContent: "center", justifyContent: "center", height: "100%" }}>
        <View className="w-full flex flex-row items-center justify-center">
          <Image source={bikeLogo} className="w-[60px] h-[60px]" resizeMode="contain" />

          <Text className="text-[55px] mt-4 pl-1" style={{ fontFamily: 'Poppins_600SemiBold' }}>
            BikeSafe
          </Text>
        </View>

        <View className="flex flex-col items-center justify-center w-full">
          <TextInput
            value={form.firstName}
            mode="outlined"
            label="First Name"
            className="h-14 w-[90%] mt-2"
            onChangeText={(e: string) => setForm({ ...form, firstName: e })}
            style={{ backgroundColor: theme.colors.surface }}
          />

          <TextInput
            value={form.lastName}
            mode="outlined"
            label="Last Name"
            className="h-14 w-[90%] mt-4"
            onChangeText={(e: string) => setForm({ ...form, lastName: e })}
            style={{ backgroundColor: theme.colors.surface }}
          />

          <TextInput
            value={form.email}
            mode="outlined"
            label="Email Address"
            className="h-14 w-[90%] mt-4"
            onChangeText={(e: string) => setForm({ ...form, email: e })}
            style={{ backgroundColor: theme.colors.surface }}
          />

          <TextInput
            value={form.password}
            mode="outlined"
            label="Password"
            className="h-14 w-[90%] mt-4"
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
            onChangeText={(e: string) => setForm({ ...form, password: e })}
            style={{ backgroundColor: theme.colors.surface }}
          />

          { passwordErrors() !== "" && (
            <HelperText type="error" visible={passwordErrors() !== ""} className="w-[90%] mt-1">
              {passwordErrors()}
            </HelperText>
          )}

          <TextInput
            value={form.confirmPassword}
            mode="outlined"
            label="Confirm Password"
            className={`h-14 w-[90%] ${passwordErrors() !== "" ? "mt-2" : "mt-4"}`}
            secureTextEntry={!confirmPaswordVisible}
            right={
              <TextInput.Icon
                icon={confirmPaswordVisible ? "eye-off" : "eye"}
                onPress={() => setConfirmPasswordVisible(!confirmPaswordVisible)}
              />
            }
            onChangeText={(e: string) => setForm({ ...form, confirmPassword: e })}
            style={{ backgroundColor: theme.colors.surface }}
          />

          { confirmPasswordErrors() !== "" && (
            <HelperText type="error" visible={confirmPasswordErrors() !== ""} className="w-[90%] mt-1">
              {confirmPasswordErrors()}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={() => AuthenticationService.handleSignUp(setSubmitting, form, router)}
            disabled={isSubmitting}
            className={`${isSubmitting ? "opacity-50" : "opacity-100"} w-[90%] h-14 flex justify-center rounded-md ${confirmPasswordErrors() !== "" ? 'mt-4' : 'mt-8'}`}
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Text className="text-base" style={{ color: theme.colors.onPrimary, fontWeight: "bold" }}>Sign Up</Text>
          </Button>

          <View className="mt-4 mb-14 w-full flex flex-row items-center justify-center">
            <Text className="w-fit text-sm">Already have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push("sign-in")}
              className="w-fit ml-1"
            >
              <Text className="w-fit text-sm">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;