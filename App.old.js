import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, Text } from 'react-native';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpscreen'; // Correct casing
// Make sure your file is named SignUpScreen.js exactly

const Stack = createNativeStackNavigator();

// Dashboard screen (placeholder)
function DashboardScreen() {
return (
<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
<Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome to Cognisync!</Text>
<Text style={{ marginTop: 10 }}>Sync your mind, master your focus.</Text>
</SafeAreaView>
);
}

export default function App() {
return (
<NavigationContainer>
<Stack.Navigator
initialRouteName="SignIn"
screenOptions={{
headerStyle: { backgroundColor: '#f4f4f4' },
headerTitleStyle: { fontWeight: 'bold' },
}}
>
<Stack.Screen
name="SignIn"
component={SignInScreen}
options={{ title: 'Sign In' }}
/>
<Stack.Screen
name="SignUp"
component={SignUpScreen}
options={{ title: 'Create Account' }}
/>
<Stack.Screen
name="Dashboard"
component={DashboardScreen}
options={{ title: 'Dashboard' }}
/>
</Stack.Navigator>
</NavigationContainer>
);
}