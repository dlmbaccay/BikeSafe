import React, { useState } from "react";
import { ToastAndroid } from "react-native";
import { Text, Portal, Button, Dialog } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { ReportType } from "../types/interfaces";
import { NullReport } from "../models/nullObjects";
import { StorageHelper } from "../utils/cloudStorageHelper";
import { FirestoreHelper } from "../utils/firestoreHelper";

interface DeleteReportProps {
  deleteReportVisible: boolean;
  hideDeleteReport: () => void;
  hideViewReport: () => void;
  reportData : ReportType;
  setMarkers: (markers: (prevMarkers: any[]) => any[]) => void;
}

const DeleteReport = ({ deleteReportVisible, hideDeleteReport, hideViewReport, reportData = NullReport, setMarkers }: DeleteReportProps) => {

  const [isDeleting, setDeleting] = useState(false);

  /**
   * handleDeleteReport
   * - Function to delete a report
   * - Deletes the report from the reports collection
   * - Deletes the report from the user's reports collection
   * - Deletes the associated image from Firebase Storage
   * - Deletes the marker if it's the only report linked to it
   * 
   */
  const handleDeleteReport = async () => {
    try {
      setDeleting(true);

      // Check if only one report is linked to the marker
      const isSingleReport = await FirestoreHelper.checkSingleReportMarker(reportData.markerId)
      if (isSingleReport) {
        // Delete the marker if it's the only report linked to it
        await FirestoreHelper.deleteMarker(reportData.markerId)

        // Update the markers state
        setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.markerId !== reportData.markerId));
      }

      // Delete the report document and its record from user
      await FirestoreHelper.deleteReport(reportData.userId, reportData.reportId)

      // Delete the associated image, if it exists
      if (reportData.imageUrl) {
        await StorageHelper.deleteImage(reportData.reportId);
      }

      setDeleting(false);
      hideViewReport();
      ToastAndroid.show("Report deleted", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error deleting report:", error);
      setDeleting(false);
      ToastAndroid.show("Failed to delete report", ToastAndroid.LONG);
    }
  };

  return (
    <Portal>
      <Dialog
        visible={deleteReportVisible}
        onDismiss={() => hideDeleteReport()}
      >
        <Dialog.Title>Delete Report</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure you want to delete this report?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDeleteReport}>Cancel</Button>
          <Button disabled={isDeleting} onPress={handleDeleteReport}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default DeleteReport;