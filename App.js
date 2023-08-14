// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// import the screens
import ShoppingLists from './components/ShoppingLists';
import Welcome from './components/Welcome';

// Initialize Firebase

const App = () => {

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
          {props => <ShoppingLists db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;