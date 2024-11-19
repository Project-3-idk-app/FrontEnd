import { Button, Image, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router';
import { fakeConcluded, fakeCurrent, fakeuser } from '@/components/Types';
import PollScroll from '@/components/Polls';

export default function UserScreen() {
    const navigator = useNavigation();
    const [user, setUser] = useState(fakeuser);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPollId, setPollId] = useState(-1);

    const getUserFromStorage = async () => {
        try {
            const user = await AsyncStorage.getItem("@user");
            if (user) {
                console.log("User found:", JSON.parse(user));
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

    // Signs User out by clearing the async storage of their info, navigates home
    const signout = async () => {
        try {
            await AsyncStorage.removeItem("@user");
            navigator.getParent()?.replace('index');
        } catch {
            console.log("Error with signing out");
        }
    }

    // When screen is focused on, get User information
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserFromStorage();
            if (user) {
                setUser(user);
            }
        };

        fetchUser();
        console.log(JSON.stringify(user, null, 2));
    }, []);

    const closeModal = () => {
        setModalVisible(false); // Close the modal
    };

    const openModal = (pollId: number) => {
        setPollId(pollId);
        setModalVisible(true);
    }
    return (
        <ThemedView style={styles.fullPage}>
            
            <View style={styles.topTab}>
                <View style={{flex: 1}}/>
                <View style={styles.userInfo}>
                    {/* Small TODO: change this to a svg so it scales nicer on desktop, rn it scales bad */}
                    <Image source={require('@/assets/images/account_circle.png')} style={styles.image} />
                    <ThemedText type="title">{user.username}</ThemedText>
                </View>
                <View style={{ flex: 1, alignContent: 'flex-end', alignItems: 'flex-start', flexWrap: 'wrap'}}>
                    <Pressable
                        style={({ pressed }) => [
                            {
                                backgroundColor: pressed ? '#3E0D6D' : '#541388', // Change color on press
                                marginRight: '10%',
                                padding: 10,
                                borderRadius: 25,
                            },
                        ]}
                        onPress={() => console.log('setting pressed')}
                    >
                        <Image source={require('@/assets/images/setting.png')} style={styles.setting} />
                    </Pressable>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1}} style={{flex:1}}>
                <ThemedText type="subtitle">Active Polls()</ThemedText>
                <PollScroll polls={fakeCurrent} onButtonPress={openModal}/>
                <ThemedText type="subtitle">Completed Polls()</ThemedText>
                <PollScroll polls={fakeConcluded} onButtonPress={openModal} />

                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{ display: 'flex', flex: 1, margin: 10 }}/>
                    <View style={{ display: 'flex', flex: 1, margin: 10 }}>
                        <Button title='Sign Out' onPress={() => signout()} color={'red'} />
                    </View>
                    <View style={{ display: 'flex', flex: 1, margin: 10}}/>
                </View>
            </ScrollView>

            <Modal
                animationType='fade'
                transparent={true} 
                visible={modalVisible}
                onRequestClose={closeModal} 
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Current Poll ID is {currentPollId} </Text>
                        <Button title="Close" onPress={closeModal} />
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
    content: {

    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    body: {
        gap: 8,
        marginBottom: 100,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
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
    setting: {
        width: Platform.OS === "web" ? 50 : 25,
        height: Platform.OS === "web" ? 50 : 25,
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
});
