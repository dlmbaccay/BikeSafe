
export interface LocationType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

// REFACTORING 4: Add NULL_LOCATION constant
export const NULL_LOCATION: LocationType = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export interface ReportType {
  markerId: string;
  reportId: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  createdAt: any;
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export interface MarkerType {
  markerId: string;
  latitude: number;
  longitude: number;
  lastCreatedReportAt: any;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
}


// REFACTORING 5: Add NULL_USER constant
export const NULL_USER: User = {
  firstName: "",
  lastName: "",
  email: "",
  avatarUrl: "",
};
