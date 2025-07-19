import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import CustomDrawerContent from '../CustomDrawerContent';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation, route }) => {
          const isDashboard = route.name === 'dashboard';

          return {
            headerTitle: 'Cognisync',
            headerTitleAlign: 'center',
            headerLeft: () =>
              isDashboard ? (
                <Ionicons
                  name="menu"
                  size={24}
                  color="black"
                  style={{ paddingLeft: 16 }}
                  onPress={() => navigation.toggleDrawer()}
                />
              ) : (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="black"
                  style={{ paddingLeft: 16 }}
                  onPress={() => navigation.goBack()}
                />
              ),
            headerRight: () =>
              isDashboard ? (
                <Ionicons
                  name="person-circle-outline"
                  size={26}
                  color="black"
                  style={{ paddingRight: 16 }}
                  onPress={() => navigation.navigate('profileDetails')}
                />
              ) : null,
          };
        }}
      >
        <Drawer.Screen name="dashboard" options={{ title: 'Cognisync' }} />
        <Drawer.Screen name="sessionHistory" options={{ title: 'Session History' }} />
        <Drawer.Screen name="goalTracker" options={{ title: 'Goal Tracker' }} />
        <Drawer.Screen name="feedback" options={{ title: 'Feedback' }} />
        <Drawer.Screen name="journaling" options={{ title: 'Journaling' }} />
        <Drawer.Screen name="profileDetails" options={{ title: 'Profile Details' }} />
        <Drawer.Screen name="startSession" options={{ title: 'Start Session' }} />
      </Drawer>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
