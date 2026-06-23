import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type ChannelsStackParamList = {
  ChannelsList: undefined;
  Messages: { channelId: string; channelName: string };
};

export type UniversitiesStackParamList = {
  UniversitiesList: undefined;
  UniversityDetail: { universityId: string; universityName: string };
};

export type AppTabParamList = {
  KanallarTab: NavigatorScreenParams<ChannelsStackParamList>;
  UniversitelerTab: NavigatorScreenParams<UniversitiesStackParamList>;
  ProfilTab: undefined;
};
