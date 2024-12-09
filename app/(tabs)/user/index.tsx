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
    const DEFAULT_PROFILE_IMAGE = require('@/assets/images/account_circle.png');
    const navigator = useNavigation();
    const [user, setUser] = useState(fakeuser);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPollId, setPollId] = useState(-1);
    const [polls, setPolls] = useState<{ polls_active: any[], polls_inactive: any[] } | null>(null);
    const [loading, setLoading] = useState(true);
    

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

    const deletePoll = async (pollId: number) => {
        try {
            const response = await fetch(`https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/delete/poll/${pollId}/`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                closeModal();
                navigator.replace('index');
            } else {
                console.error('Failed to delete poll');
            }
        } catch (error) {
            console.error('Error deleting poll:', error);
        }
    };


    // When screen is focused on, get User information
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserFromStorage();
            if (user) {
                setUser(user);
            }
            const fetchPolls = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/userpolls/${user.id}`);
                    const data = await response.json();
                    setPolls(data); // API now returns active polls directly
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching polls:', error);
                    setLoading(false);
                }
            };
      
            fetchPolls();
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
                    <Image
                        source={user.picture ? { uri: user.picture } : DEFAULT_PROFILE_IMAGE}
                        style={styles.userImage}
                    />
                    <ThemedText style={styles.title}type="title">{user.username}</ThemedText>
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
                        onPress={() => navigator.navigate('settings')}
                    >
                        <Image source={require('@/assets/images/setting.png')} style={styles.setting} />
                    </Pressable>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1}} style={{flex:1}}>
                {polls && (
                    <>
                        <ThemedText style={styles.subtitle} type="subtitle">Active Polls</ThemedText>
                        <PollScroll polls={polls.polls_active} onButtonPress={openModal}/>
                        <ThemedText style={styles.subtitle} type="subtitle">Completed Polls</ThemedText>
                        <PollScroll polls={polls.polls_inactive} onButtonPress={openModal} />
                    </>
                )} 
                {!polls && !loading &&(
                    <View style={{ marginVertical: 20, alignItems: 'center' }}>
                        <ThemedText type="defaultSemiBold">A whole lot of nothing, get to making polls!</ThemedText>
                    </View>
                )}
                {loading && (
                    <View style={{ marginVertical: 20, alignSelf: 'center'}}>
                        <ThemedText type="defaultSemiBold">Loading...</ThemedText>
                    </View>
                )}

                <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{ display: 'flex', flex: 1, margin: 10 }}/>
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
            <Text style={styles.modalText}>Are you sure you want to delete this poll?</Text>
            <View style={styles.modalButtons}>
                <Pressable
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={() => deletePoll(currentPollId)}
                >
                    <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
                </Pressable>
                <Pressable
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={closeModal}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
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
    title:{
        fontFamily: 'LexendDeca',
        fontStyle: 'normal',
        fontWeight: '400',
        color: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
    },
    userImage: {
        width: 46,
        height: 46,
        borderRadius: 23,
        marginRight: 10,
    },
    subtitle:{
        marginLeft: 10,
        marginTop: 10
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
        fontFamily: 'LexendDeca'
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalContent: {
        width: 400,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily:'LexendDeca'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        width: '100%',
        marginTop: 5,
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',  
    },
    deleteButton: {
        backgroundColor: '#FF3B30',  
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily:'LexendDeca'
    },
    deleteButtonText: {
        color: 'white',
    }
});
