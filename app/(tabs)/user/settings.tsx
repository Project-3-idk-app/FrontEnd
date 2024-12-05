import { Alert, Button, Image, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router';
import { fakeConcluded, fakeCurrent, fakeuser, showAlert } from '@/components/Types';
import PollScroll from '@/components/Polls';
import { deleteAccount, searchUsersBool, updateUser } from '@/components/DataBaseFuncs';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function UserScreen() {
    const navigator = useNavigation();
    const [user, setUser] = useState(fakeuser);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const getUserFromStorage = async () => {
        try {
            const user = await AsyncStorage.getItem("@user");
            if (user) {
                console.log("User locally saved:", JSON.parse(user));
                return JSON.parse(user);
            } else {
                console.log("No user found in AsyncStorage.");
                return null;
            }
        } catch (error) {
            console.error("Error getting user from AsyncStorage", error);
            return null;
        }
    };

    // When screen is focused on, get User information
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserFromStorage();
            if (user) {
                setUser(user);
                setUsername(user.username);
                setEmail(user.email);
            }
        };

        fetchUser();
        console.log(JSON.stringify(user, null, 2));
    }, []);

    const closeModal = () => {
        setModalVisible(false); // Close the modal
    };

    const checkChanges = async () => {
        if(user.username != username){
            console.log('settings: changing username')
            let result = await searchUsersBool(username);
            if (!result) {
                showAlert('Error', "Username already taken");
                return;
            }
            user.username = username;

        }
        if(user.email != email){
            user.email = email;
            console.log('settings: changing email')

        }
        let response = await updateUser(user);
        if(response) {
            await AsyncStorage.setItem("@user", JSON.stringify(response));
            showAlert("Success", "Changes Saved!");
        }
        else {
            showAlert("Fail", "There was an error, please try again");
        }
    }

    const signout = async () => {
        
        try {
            await AsyncStorage.removeItem("@user");
            navigator.getParent()?.replace('index');
        } catch {
            console.log("Error with signing out");
        }
        
    }
    const onDelete = async () => {
        let response = await deleteAccount(user.id);
        if (response) {
            await AsyncStorage.removeItem("@user");
            showAlert("Success", "Account Deleted");
            await signout();
        }
        else {
            showAlert("Fail", "There was an error, please try again");
        }
    } 



    return (
        <ThemedView style={styles.fullPage}>
            <View style={styles.topTab}>
                <TouchableOpacity
                    onPress={() => navigator.navigate('index')}
                    style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.tabText}>Add a Friend</Text>
                </View>
                <View style={styles.backButton} />
            </View>

            <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 10}}>
                <ThemedText style={{fontSize: 36, lineHeight:50, fontFamily: 'LexendDeca'}}>Edit Profile</ThemedText>
                <View style={styles.card}>
                    <View>
                        <Text style={styles.label}>Username:</Text>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="Username"
                            placeholderTextColor="#aaa"
                            value={username} 
                            onChangeText={setUsername}
                        />
                    </View>
                    <View>
                        <Text style={styles.label}>Email:</Text>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="email"
                            placeholderTextColor="#aaa"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                        <Pressable
                            style={({ pressed }) => [
                                {
                                    backgroundColor: pressed ? '#796edb' : '#665DB7', // Change color on press
                                    padding: 10,
                                    borderRadius: 25,
                                    width: '55%',
                                    alignItems: 'center',
                                    margin: 10,
                                },
                            ]}
                            onPress={() => checkChanges()}
                        >
                            <Text style={{ color: 'white', fontFamily: 'LexendDeca'}}> Save Changes </Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                {
                                    backgroundColor: pressed ? '#2e3959' : '#1E253A', // Change color on press
                                    padding: 10,
                                    borderRadius: 25,
                                    width: '55%',
                                    alignItems: 'center',
                                },
                            ]}
                            onPress={async () => signout()}
                        >
                            <Text style={{ color: 'white', fontFamily: 'LexendDeca' }}> Logout </Text>
                        </Pressable>
                    </View>

                </View>
                <Pressable
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? '#2e3959' : '#B23A78', // Change color on press
                            padding: 10,
                            borderRadius: 25,
                            width: '40%',
                            alignItems: 'center',
                        },
                    ]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={{ color: 'white', fontFamily: 'LexendDeca' }}> Delete Account </Text>
                </Pressable>
            </View>

            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are You sure you want to delete your account?</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                            <View style={{ flex: 3 }}>
                                <Button title="No" onPress={closeModal} color={'grey'} />
                            </View>
                            <View style={{flex: 1}}/>
                            <View style={{ flex: 3 }}>
                                <Button title="Delete" onPress={onDelete} color={'red'} />
                            </View>

                        </View>

                    </View>
                </View>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    fullPage: {
        flex: 1
    },
    topTab: {
        backgroundColor: "#CB046B",
        paddingTop: (StatusBar.currentHeight || 0) + 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: Platform.OS === "web" ? 100 : 50,
        height: Platform.OS === "web" ? 100 : 50,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#541388',
        borderRadius: 20,
        width: '90%',
        marginVertical: 20,
        paddingHorizontal: 40,
        paddingVertical: 10,
    },
    inputBox: {
        width: '100%',
        padding: 12,
        borderRadius: 25,
        backgroundColor: '#fff',
        color: '#000',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
        fontSize: 16,
    },
    label: {
        fontSize: 20,
        fontFamily: 'LexendDeca',
        color: 'white',
        margin: 5,
    },
    titleContainer: {
        flex: 4,
        alignItems: 'center',
    },
    backButton: {
        padding: 10,
        flex: 1,
    },
    tabText: {
        fontFamily: 'LexendDeca',
        fontSize: 30,
        color: '#FFFFFF',
        textAlign: 'center',
        paddingVertical: 10,
    },
});
