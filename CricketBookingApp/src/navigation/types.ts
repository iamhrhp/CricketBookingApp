import type { NavigatorScreenParams } from '@react-navigation/native';

export type BookingFlowParams = {
  clubId: string;
  clubName: string;
  slot: string;
  duration: number;
  amount: number;
  date: string;
};

export type SelectedClub = {
  id: string;
  name: string;
};

export type HomeStackParamList = {
  Home: undefined;
  ClubDetails: { clubId: string };
  CreateActivity: { selectedClub?: SelectedClub } | undefined;
  SelectClub: { selectedClubId?: string };
  AllClubs: undefined;
  ActivityDetails: { activityId: string };
  Checkout: BookingFlowParams;
  Payment: BookingFlowParams;
  Confirmation: BookingFlowParams & { paymentMethod: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookingTab: NavigatorScreenParams<BookingStackParamList>;
  AITab: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};

export type BookingStackParamList = {
  Booking: undefined;
  BookingDetails: { bookingId: string };
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
