import storage from '@react-native-firebase/storage'

export class StorageHelper {
  /**
   * uploadImage
   * - Function to upload the image to Firebase Storage
   * - Uploads the image to the reports folder with the reportId as the filename
   * - Returns the download URL of the uploaded image
   * 
   * @param reportId - the reportId to use as the filename within Firebase Storage
   * @param imageUri - the string identifier for image resource
   * @returns string | null
   */
  public static async uploadImage(reportId: string, imageUri: string | null) {
    if (!imageUri) return null;

    try {
      const imageRef = storage().ref(`reports/${reportId}/image.jpg`);
      await imageRef.putFile(imageUri);
      return await imageRef.getDownloadURL();
    } catch (error) {
      console.error("Error uploading report image: ", error);
      return null;
    }
  }

  public static async deleteImage(reportId: string) {
    await storage().ref(`reports/${reportId}/image.jpg`).delete();
  }
  
  /**
   * uploadAvatar
   * - Function to upload the user's new avatar to Firebase Storage
   * - Uploads the avatar to the avatars collection in Firebase Storage
   * - Returns the download URL of the uploaded avatar
   * 
   * @param userId - the user's ID
   * @param imageUri - the string identifier for image resource
   * @returns the download URL of the uploaded avatar
   */
  public static async uploadAvatar(userId: string, imageUri: string | null) {
    if (!imageUri) return null;

    try {
      const imageRef = storage().ref(`avatars/${userId}/avatar.jpg`);
      await imageRef.putFile(imageUri);
      return await imageRef.getDownloadURL();
    } catch (error) {
      console.error("Error uploading avatar: ", error);
      return null;
    }
  }
}
