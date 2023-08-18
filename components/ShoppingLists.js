import { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, addDoc, onSnapshot, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


const ShoppingLists = ({ db, route, isConnected }) => {
    const [lists, setLists] = useState([]);
    const [listName, setListName] = useState("");
    const [item1, setItem1] = useState("");
    const [item2, setItem2] = useState("");
    const [item3, setItem3] = useState("");

    const { userID } = route.params;

    let unsubShoppinglists;

    useEffect(() => {
        if (isConnected === true) {
            // unregister current onSnapshot() listener to avoid registering multiple listeners when
            // useEffect code is re-executed.
            if (unsubShoppinglists) unsubShoppinglists();
            unsubShoppinglists = null;

            //sets up a snapshot fx which pushes new changes automatically
            // the "query" & "where" functions functions are used to extract only the lists specific to the userID

            const q = query(collection(db, "shoppinglists"), where("uid", "==", userID));
            unsubShoppinglists = onSnapshot(q, (documentsSnapshot) => {
                let newLists = [];
                documentsSnapshot.forEach(doc => {
                    newLists.push({ id: doc.id, ...doc.data() })
                });
                // sets newLists to cache & updates state
                cacheShoppingLists(newLists)
                setLists(newLists);
            });
        } else loadCachedLists();

        // Clean up code
        return () => {
            if (unsubShoppinglists) unsubShoppinglists();
        }
    }, [isConnected]);

    // sets the shopping list to the local storage (must be stored as strings!)
    // try / catch is an error handling mechanism, in case somethingi goes wrong

    const cacheShoppingLists = async (listsToCache) => {
        try {
            await AsyncStorage.setItem('shopping_lists', JSON.stringify(listsToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    // function to add a new shopping list to the firebase DB
    const addShoppingList = async (newList) => {
        const newListRef = await addDoc(collection(db, "shoppinglists"), newList);
        // if the list is successfully created, will have an .id value
        if (newListRef.id) {
            //this code adds the list to the UI by making an api call to the db
            setLists([newList, ...lists]);
            Alert.alert(`The list "${listName}" has been added`);
        } else {
            Alert.alert("Unable to add list to database");
        }
    }

    // function to load lists from cache

    const loadCachedLists = async () => {
        const cachedLists = await AsyncStorage.getItem('shopping_lists') || []; // sets cached list to empty array if something fails
        // cache stores lists as strings, so have to parse them first
        setLists(JSON.parse(cachedLists));
    }
    return (
        <View style={styles.container}>
            <FlatList
                style={styles.listsContainer}
                data={lists}
                renderItem={({ item }) =>
                    <View style={styles.listItem}>
                        <Text>{item.name}: {item.items.join(", ")}</Text>
                    </View>
                }
            />
            {isConnected === true ?
            <View style={styles.listForm}>
                <TextInput
                    style={styles.listName}
                    placeholder="List Name"
                    value={listName}
                    onChangeText={setListName}
                />
                <TextInput
                    style={styles.item}
                    placeholder="Item #1"
                    value={item1}
                    onChangeText={setItem1}
                />
                <TextInput
                    style={styles.item}
                    placeholder="Item #2"
                    value={item2}
                    onChangeText={setItem2}
                />
                <TextInput
                    style={styles.item}
                    placeholder="Item #3"
                    value={item3}
                    onChangeText={setItem3}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        const newList = {
                            uid: userID,
                            name: listName,
                            items: [item1, item2, item3]
                        }
                        addShoppingList(newList);
                    }}
                >
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View> : null }
            {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listItem: {
        height: 70,
        justifyContent: "center",
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderBottomColor: "#AAA",
        flex: 0.7,
        flexGrow: 1
    },
    listsContainer: {
        flex: 0.5,
    },
    listForm: {
        flexBasis: 275,
        flex: 0.5,
        margin: 15,
        padding: 15,
        backgroundColor: "#CCC"
    },
    listName: {
        height: 50,
        padding: 15,
        fontWeight: "600",
        marginRight: 50,
        marginBottom: 15,
        borderColor: "#555",
        borderWidth: 2
    },
    item: {
        height: 50,
        padding: 15,
        marginLeft: 50,
        marginBottom: 15,
        borderColor: "#555",
        borderWidth: 2
    },
    addButton: {
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        backgroundColor: "#000",
        color: "#FFF"
    },
    addButtonText: {
        color: "#FFF",
        fontWeight: "600",
        fontSize: 20
    }
});

export default ShoppingLists;
