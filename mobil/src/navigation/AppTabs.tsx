import React from 'react';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChannelsScreen from '../screens/channels/ChannelsScreen';
import MessagesScreen from '../screens/channels/MessagesScreen';
import UniversitiesScreen from '../screens/universities/UniversitiesScreen';
import UniversityDetailScreen from '../screens/universities/UniversityDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors } from '../theme/theme';
import type {
  AppTabParamList,
  ChannelsStackParamList,
  UniversitiesStackParamList,
} from './types';

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.darkBg },
  headerTintColor: colors.white,
  contentStyle: { backgroundColor: colors.veryDarkBg },
} as const;

const ChannelsNav = createNativeStackNavigator<ChannelsStackParamList>();
function ChannelsStack() {
  return (
    <ChannelsNav.Navigator screenOptions={stackScreenOptions}>
      <ChannelsNav.Screen
        name="ChannelsList"
        component={ChannelsScreen}
        options={{ headerShown: false }}
      />
      <ChannelsNav.Screen name="Messages" component={MessagesScreen} options={{ title: 'Mesajlar' }} />
    </ChannelsNav.Navigator>
  );
}

const UniversitiesNav = createNativeStackNavigator<UniversitiesStackParamList>();
function UniversitiesStack() {
  return (
    <UniversitiesNav.Navigator screenOptions={stackScreenOptions}>
      <UniversitiesNav.Screen
        name="UniversitiesList"
        component={UniversitiesScreen}
        options={{ headerShown: false }}
      />
      <UniversitiesNav.Screen
        name="UniversityDetail"
        component={UniversityDetailScreen}
        options={{ title: 'Universite' }}
      />
    </UniversitiesNav.Navigator>
  );
}

const Tab = createBottomTabNavigator<AppTabParamList>();

function tabIcon(icon: string) {
  return ({ focused }: { focused: boolean }) => (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.55 }}>{icon}</Text>
  );
}

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.darkBg, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="KanallarTab"
        component={ChannelsStack}
        options={{ title: 'Kanallar', tabBarIcon: tabIcon('💬') }}
      />
      <Tab.Screen
        name="UniversitelerTab"
        component={UniversitiesStack}
        options={{ title: 'Universiteler', tabBarIcon: tabIcon('🏫') }}
      />
      <Tab.Screen
        name="ProfilTab"
        component={ProfileScreen}
        options={{ title: 'Profil', tabBarIcon: tabIcon('👤') }}
      />
    </Tab.Navigator>
  );
}
