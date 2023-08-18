// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from "react";
import { LogBox, Alert } from "react-native";

// package to determine whether user has internet acces or not
import { useNetInfo } from '@react-native-community/netinfo';

// Create the navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";

// import the screens
import ShoppingLists from './components/ShoppingLists';
import Welcome from './components/Welcome';

// Initialize Firebase

const App = () => {

  // determines connection status

  const connectionStatus = useNetInfo();

  // displays an alert if user is offline

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // these are the firbase DB credentials
  const firebaseConfig = {

    apiKey: "AIzaSyD9LXf4NyHOqiEV6qCbbNmroDYyPSasppE",
    authDomain: "shopping-list-demo-be4d1.firebaseapp.com",
    projectId: "shopping-list-demo-be4d1",
    storageBucket: "shopping-list-demo-be4d1.appspot.com",
    messagingSenderId: "996218734843",
    appId: "1:996218734843:web:696200325bf6868352885e"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
      >
        <Stack.Screen
          name="Welcome" component={Welcome}
        />
        <Stack.Screen
          name="shoppingLists"
        >
          {/* this is the syntax for passing props in stackScrenn */}
          {/* here two props are passed, db and the connection status boolean */}
          {props => <ShoppingLists isConnected = {connectionStatus.isConnected} db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;