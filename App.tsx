import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BookProvider, useBooks } from './src/context/BookContext';
import { Button, Screen } from './src/components/UI';
import BookListScreen from './src/screens/BookListScreen';
import BookFormScreen from './src/screens/BookFormScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import { colors, styles } from './src/theme/theme';
import type { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { loading, loadError, loadBooks } = useBooks();

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
          <Text style={styles.muted}>Đang tải thư viện...</Text>
        </View>
      </Screen>
    );
  }

  if (loadError) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.error}>{loadError}</Text>
          <Button
            title="Thử lại"
            onPress={() => {
              void loadBooks();
            }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen
          name="BookList"
          component={BookListScreen}
          options={{ title: 'Thư viện của tôi' }}
        />

        <Stack.Screen
          name="BookForm"
          component={BookFormScreen}
          options={({ route }) => ({
            title: route.params?.id ? 'Sửa sách' : 'Thêm sách',
          })}
        />

        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{ title: 'Chi tiết sách' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <BookProvider>
        <AppNavigator />
      </BookProvider>
    </SafeAreaProvider>
  );
}