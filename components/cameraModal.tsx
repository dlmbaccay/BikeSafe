import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Button, Text, Dialog } from "react-native-paper";

import { DeviceHandler } from "../utils/deviceHandler";

interface CameraModalProps {
  cameraVisible: boolean;
  hideCamera: () => void;
  setImage: (image: string) => void;
}

const CameraModal = ({ cameraVisible, hideCamera, setImage }: CameraModalProps) => {


  return (
    <Dialog visible={cameraVisible}>
      <Dialog.Title>Capture</Dialog.Title>
      <Dialog.Content>
        <Text>You'll be redirected to your camera app to take a picture.</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={hideCamera}>Cancel</Button>
        <Button onPress={() => DeviceHandler.openCamera(setImage, hideCamera)}>Open Camera</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default CameraModal;