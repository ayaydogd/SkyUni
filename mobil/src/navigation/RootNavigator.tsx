import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useAuth } from '../viewmodels/AuthContext';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { Loading } from '../components/Feedback';
import { Screen } from '../components/Screen';
import { colors } from '../theme/theme';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.veryDarkBg,
    card: colors.darkBg,
    text: colors.white,
    border: colors.border,
    primary: colors.primary,
  },
};

export function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <Screen>
        <Loading label="Yukleniyor..." />
      </Screen>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {status === 'authenticated' ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
