import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const Welcome = ({ navigation }) => {
    // initialises the firebase authentication handler
    const auth = getAuth();

const signInUser = () => {
    signInAnonymously(auth)
    .then(result => {
        navigation.navigate('shoppingLists', {userID: result.user.uid});
        Alert.alert('Signed in successfully');
    })
    .catch((error) => {
        Alert.alert('Sign-in failed, please try again');
    });
};

    return (
        <View style={styles.container}>
            <Text style={styles.appTitle}>Shopping Lists</Text>
            <TouchableOpacity
                style={styles.startButton}
                onPress={signInUser}>
                <Text style={styles.startButtonText}>Get started</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    appTitle: {
        fontWeight: "600",
        fontSize: 45,
        marginBottom: 100,
    },
    startButton: {
        backgroundColor: "#000",
        height: 50,
        width: "88%",
        justifyContent: "center",
        alignItems: "center",
    },
    startButtonText: {
        color: "#fff",
    },
});

export default Welcome;