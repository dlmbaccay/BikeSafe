import { View, Image, TouchableOpacity, Alert, ToastAndroid, useColorScheme } from "react-native";
import auth from "@react-native-firebase/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import firestore from "@react-native-firebase/firestore";

export class AuthenticationService {
    /**
     * handleSignIn
     * - Function to handle user sign in
     * - Signs in user using Firebase Auth
     * - Checks if email is verified
     * - Navigates to home screen if successful
     * 
     */
    public static async handleSignIn(setSubmitting: any, form: any, router: any) {
        setSubmitting(true);

        if (form.email === "" || form.password === "") {
            setSubmitting(true);

            Alert.alert(
                "Form Error!",
                "Please fill in the fields before submitting."
            );

            setSubmitting(false);
            return;
        }

        await auth()
            .signInWithEmailAndPassword(form.email, form.password) // sign in user
            .then(() => {
                if (!auth().currentUser?.emailVerified) { // check if email is verified

                    // if not, send email verification
                    Alert.alert(
                        "Verify your email first",
                        "An email verification has been sent to your email address. Please verify your email to continue"
                    )

                    setSubmitting(false);
                    return;
                } else { // else, navigate to home screen
                    setSubmitting(false);
                    ToastAndroid.show("You're logged in!", ToastAndroid.SHORT);
                    router.push("home");
                }
            })
            .catch((error) => {
                if (error.code === "auth/user-not-found") { // check if user is not found
                    Alert.alert(
                        "User not found",
                        "User not found. Please check your email address and try again",
                    );
                } else if ( // invalid credentials validation
                    error.code === "auth/invalid-password" ||
                    error.code === "auth/invalid-email" || error.code === "auth/invalid-credential"
                ) {
                    Alert.alert(
                        "Invalid email or password",
                        "Please check your email and password and try again",
                    );
                } else {
                    console.log(error);
                }

                setSubmitting(false);
                return;
            })
    };

    /**
     * handleSignUp
     * - Function to handle user sign up
     * - Signs up user using Firebase Auth
     * - Saves user details to Firestore
     * - Sends email verification to user
     * - Navigates to sign in page if successful
     * 
    */

    public static async handleSignUp(setSubmitting: any, form: any, router: any)  {
        setSubmitting(true);

        if ( // check if any field is empty
            form.firstName === "" ||
            form.lastName === "" ||
            form.email === "" ||
            form.password === "" ||
            form.confirmPassword === ""
        ) {
            Alert.alert(
                "All fields are required",
                "Please fill in all fields before submitting."
            );
            setSubmitting(false);
            return;
        } else if (!form.email.includes("@") || !form.email.includes(".")) { // check if email is valid
            Alert.alert("Error", "Invalid email address");
            setSubmitting(false);
            return;
        } else if (form.password.length < 6) { // check if password is at least 6 characters
            Alert.alert("Error", "Password must be at least 6 characters");
            setSubmitting(false);
            return;
        } else if (form.password !== form.confirmPassword) { // check if passwords match
            Alert.alert("Error", "Passwords do not match");
            setSubmitting(false);
            return;
        }

        await auth()
            .createUserWithEmailAndPassword(form.email, form.password) // create user
            .then((response) => {
                // send email verification
                auth().currentUser?.sendEmailVerification();

                // save user details to firestore with default avatar URL
                firestore().collection("users").doc(response.user.uid).set({
                    uid: response.user.uid,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    createdAt: new Date(),
                    avatarUrl:
                        "https://firebasestorage.googleapis.com/v0/b/bike-app-ca815.appspot.com/o/default-avatar-icon.png?alt=media&token=2682e441-d460-4a67-9af4-1c446e196244", // Pre-uploaded default avatar
                });

                Alert.alert(
                    "Account Created!",
                    "Please verify your email address to login.",
                );

                setSubmitting(false);

                // redirect to sign in page
                router.push("sign-in");
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    Alert.alert("Error", "Email address already in use");
                    setSubmitting(false);
                } else {
                    console.log(error);
                    Alert.alert("Error", error.message);
                    setSubmitting(false);
                }
            });
    };
    

    /**
     * handleForgotPassword
     * - Function to send a password reset email
     * - Sends a password reset email to the provided email address
     * - Only sends an email if the email address is valid
    */
    public static async handleForgotPassword(email: string, setSubmitting: any, hideForgotModal: any) { {
        if (email === "") {
            Alert.alert("Form Error!", "Please fill in the email address field");
            return;
        } else if (!email.includes("@") || !email.includes(".")) {
            Alert.alert("Error!", "A valid email address is required");
            return;
        }

        setSubmitting(true);

        await auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                ToastAndroid.show("Password reset email sent", ToastAndroid.SHORT);
                hideForgotModal();
            })
            .catch((error) => {
                if (error.code === "auth/user-not-found") {
                    Alert.alert("Error", "Email address not found");
                } else {
                    Alert.alert("Error", "An error occurred. Please try again later");
                }
            })
            .finally(() => {
                setSubmitting(false);
                hideForgotModal();
            });
        }
    };
}