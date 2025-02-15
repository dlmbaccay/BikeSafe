
import * as ImagePicker from "expo-image-picker";
import { Animated, View, Alert, ToastAndroid, Image, TouchableOpacity } from "react-native";

export class DeviceHandler {

    private static async imagePicker(){
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        return result;
    }

    /**
         * handleChangeAvatar
         * - Function to change the user's avatar
         * - Uses ImagePicker to select an image from the device's gallery
         * - Sets the newAvatarUrl state to the selected image
         * 
    */
    public static async handleChangeAvatar(setNewAvatarUrl: any) {
        const result = await DeviceHandler.imagePicker();

        if (!result.canceled) {
            setNewAvatarUrl(result.assets[0].uri);
        }
    }

    /**
         * pickImage
         * - Function to pick an image from the device's gallery
         * - Uses ImagePicker to select an image
         * - Sets the image state to the selected image
         * - Different from CameraModal which uses the device's camera
         * 
    */
    public static async pickImage(setImage: any)  {
        try {
            const pickerResult = await DeviceHandler.imagePicker();

            if (!pickerResult.canceled) {
                setImage(pickerResult.assets[0].uri);
            }
        } catch (error) {
            console.error("Error selecting image: ", error);
            ToastAndroid.show("Error selecting image", ToastAndroid.SHORT);
        }
    };

    /**
         * openCamera
         * - Function to open the device's camera
         * - Uses ImagePicker to open the camera
         * - Sets the image state to the taken picture
         * - Hides the camera modal after taking a picture
         * 
    */
    public static async openCamera(setImage: any, hideCamera: any) {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        // If the user cancels the camera, simply close the camera modal
        if (result.canceled) {
            hideCamera(); // Close the camera modal
            return;
        }

        // If the user successfully takes a picture, set the image and hide the camera modal
        if (result.assets?.[0]?.uri) {
            setImage(result.assets[0].uri); // Set the image URI when the picture is taken
            hideCamera();
        }
    };


};