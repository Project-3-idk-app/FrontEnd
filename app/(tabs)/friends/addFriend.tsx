import { Animated, StatusBar, StyleSheet, View, Text, TextInput, Pressable, TouchableOpacity, Image, FlatList, Alert, Modal, Platform, Button } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { searchUsersArray, sendFriendRequest } from '@/components/DataBaseFuncs';
import { ThemedText } from '@/components/ThemedText';
import { fakeuser, showAlert, User } from '@/components/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddFriend() {
    const navigator = useNavigation();
    const [username, setUsername] = useState('');
    const [hasResults, setHasResults] = useState(true);
    const [userList, setUserList] = useState([]);
    const [user, setUser] = useState(fakeuser);
    const [modalVisible, setModalVisible] = useState(false);

    // When screen is focused on, get User information
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await AsyncStorage.getItem("@user");
                const user = JSON.parse(data);
                if (user) {
                    setUser(user);
                }
            } catch (error) {
                let temp = user;
                temp.id = '-1'
                setUser(temp);
                console.error("Error getting user from AsyncStorage", error);
            }
        };
        fetchUser();
        console.log('addFriend.tsx: ' + JSON.stringify(user));
    }, []);

    // close modal upon opening it
    useEffect(() => {
        if (modalVisible) {
            // Close the modal after 2 seconds
            const timer = setTimeout(() => {
                setModalVisible(false);
            }, 2000);

            // Cleanup the timer
            return () => {
                clearTimeout(timer);
                navigator.navigate('index');
            };
        }
    }, [modalVisible]);


    const handleBack = () => {
        navigator.navigate('index');
    };

    React.useEffect(() => {
        navigator.setOptions({ headerShown: false });
    }, [navigator]);

    const searchUser = async () => {
        setHasResults(true);
        let data = await searchUsersArray(username.trim());
        if (data.length == 0) {
            setHasResults(false);
            return
        }
        setUserList(data);
    };

    const handleAddFriend = async (id: string) => {
        console.log(`Add friend request sent to user ID: ${id}`);
        if (user.id != '-1') {
            let response = await sendFriendRequest(user.id, id);
            if (response) {
                setModalVisible(true);
            }
        } else {
            showAlert('Error', 'Error with making friend, please try signing in again');
        }

    };

    const renderUser = ({ item }: { item: User }) => (
        <View style={styles.userContainer}>
            <Image
                source={{ uri: item.picture || require('@/assets/images/account_circle.png') }}
                style={styles.userImage}
            />
            <View style={styles.userInfo}>
                <Text style={styles.username}>{item.username}</Text>
            </View>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddFriend(item.id)}
            >
                <Text style={styles.addButtonText}>Add Friend</Text>
            </TouchableOpacity>
        </View>
    );
    return (
        <ThemedView style={styles.fullPage}>
            <SafeAreaView style={styles.container}>
                <View style={styles.topTab}>
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.tabText}>Add a Friend</Text>
                    </View>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.searchContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.searchText}
                            placeholder="Search for a username ..."
                            placeholderTextColor="#FFFFFF"
                            onChangeText={setUsername}
                            maxLength={100}
                        />
                    </View>
                    <TouchableOpacity onPress={searchUser}>
                        <LinearGradient
                            colors={['#541388', '#D90368']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.searchButton}>
                            <Text style={styles.searchButtonText}>Search</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    {hasResults ?
                        <FlatList
                            data={userList}
                            keyExtractor={(item) => item.id}
                            renderItem={renderUser}
                            contentContainerStyle={styles.list}
                        /> :
                        <View>
                            <ThemedText>No names found</ThemedText>
                        </View>
                    }
                </View>
                {/* Modal */}
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.overlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Friend Request Sent!</Text>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    fullPage: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    titleContainer: {
        flex: 4,
        alignItems: 'center',
    },
    topTab: {
        backgroundColor: "#D90368",
        paddingTop: StatusBar.currentHeight || 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        paddingBottom: 10,
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
        width: '70%',
        alignSelf:'center',
        gap: 10,
      
    },
    inputWrapper: {
        flex: 1,
        maxWidth: '70%',

    },
    searchText: {
        backgroundColor: '#665DB7',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 16,
        color: '#FFFFFF',
        width: '100%',
        fontFamily: 'LexendDeca',
    },
    searchButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        minWidth: 100,
    },
    searchButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'LexendDeca',
    },
    list: {
        padding: 16,
        width: '100%',
        
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: '100%',
        maxWidth: Platform.select({
          web: 850, 
          android: '100%' 
        }),
        alignSelf: 'center',
    },
    userImage: {
        width: 46,
        height: 46,
        borderRadius: 23,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontFamily: 'LexendDeca'
    },
    addButton: {
        paddingVertical: 5,
        paddingHorizontal: 16,
        backgroundColor: '#4caf50',
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontFamily: 'LexendDeca'
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 100,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'LexendDeca',
    },
});