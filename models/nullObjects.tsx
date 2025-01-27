import { User, ReportType, LocationType, MarkerType } from '../types/interfaces';

export const NullUser: User = {
  firstName: '',
  lastName: '',
  email: '',
  avatarUrl: ''
}

export const NullReport: ReportType = {
  markerId: '',
  reportId: '',
  title: '',
  description: '',
  latitude: 0,
  longitude: 0,
  createdAt: '',
  userId: '',
  firstName: '',
  lastName: '',
  imageUrl: ''
}

export const NullMarker: MarkerType = {
  markerId: '',
  latitude: 0,
  longitude: 0,
  lastCreatedReportAt: ''
}

export const NullLocation: LocationType = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0,
  longitudeDelta: 0
}