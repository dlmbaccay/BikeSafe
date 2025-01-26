import { ReportType } from "../types/interfaces";

// Null Object Design Pattern for ReportType
export class NullReport implements ReportType {
  markerId = "";
  reportId = "";
  title = "No Report";
  description = "";
  latitude = 0;
  longitude = 0;
  createdAt = new Date();
  userId = "";
  firstName = "";
  lastName = "";
  imageUrl = "";
}