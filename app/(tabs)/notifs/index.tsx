import { Button, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { fakeFriendRequests, fakeuser, friendStatus, showAlert } from '@/components/Types';
import FriendRequestComponent from '@/components/Request';
import { acceptFriendRequest, getNotifications, getUserInfoDb, rejectFriendRequest } from '@/components/DataBaseFuncs';
import { useNavigation } from 'expo-router';

export default function FeedScreen() {
    const [currentUser, setCurrentUser] = useState(fakeuser);
    // requestInfo contains ids and status, profiles contains an array of type User
    const [friendRequests, setFriendRequests] = useState({ requestInfo: [], profiles: [] });
    const [loading, setLoading] = useState(true);
    const navigator = useNavigation();

    const fetchFriendRequests = async (userId) => {
        setLoading(true);
        let temp = { requestInfo: [], profiles: [] };
        console.log('we are in fetch friends');
        try{
            // TODO: get the requests that are pending
            let data = await getNotifications(userId);
            if (data) {
                // need to filter pending requests
                console.log('filtering');
                const filteredData = data.filter(item => item.status === friendStatus.PENDING);
                temp.requestInfo = filteredData

                for(let i of filteredData) {
                    let userInfo = await getUserInfoDb(i.user_id2);
                    temp.profiles.push(userInfo);
                }
                setFriendRequests(temp);
                console.log('notifs: friendRequests', friendRequests );
            }
        } catch (error) {
            console.error("notifs friendFetch: ", error);
        }

        setLoading(false);
    };

    const handleAcceptRequest = async (friendId : string) => {
        console.log(`Accepted friend request from user ${friendId}`);

        try{
            // accept the friend request
            let response = await acceptFriendRequest(currentUser.id, friendId);
            // Remove the accepted request from the list
            if (response){
                let temp = friendRequests;
                temp.requestInfo = temp.requestInfo.filter(item => item.user_id2 !== friendId);
                temp.profiles = temp.profiles.filter(item => item.id !== friendId);
                setFriendRequests(temp);
                navigator.replace('index');
            }
        } catch (error) {
            console.log('Error: ', error);
            showAlert('Error', 'Error with accept, please refresh and try again');
        }

    };

    const handleDeclineRequest = async (friendId) => {
        // Remove the declined request from the list
        console.log('predecline and it looks like', friendRequests);

        try {
            // delete the friend request
            let response = await rejectFriendRequest(currentUser.id, friendId);
            // Remove the accepted request from the list
            if (response) {
                let temp = friendRequests;
                temp.requestInfo = temp.requestInfo.filter(item => item.user_id2 !== friendId);
                temp.profiles = temp.profiles.filter(item => item.id !== friendId);
                setFriendRequests(temp);
                navigator.replace('index');

            }
        } catch (error) {
            console.log('Error: ', error);
            showAlert('Error', 'Error with accept, please refresh and try again');
        }
        console.log('declined and it looks like', friendRequests);
        console.log(`Declined friend request from user ${friendId}`);
    };

    // When screen is focused on, get User information
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await AsyncStorage.getItem("@user");
                const userObj = JSON.parse(data);
                if (userObj) {
                    setCurrentUser(userObj);
                    console.log("notifs: current User: ", currentUser);
                    await fetchFriendRequests(userObj.id);
                }
            } catch (error) {
                let temp = currentUser;
                temp.id = '-1'
                setCurrentUser(temp);
                console.error("Error getting user from AsyncStorage", error);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ThemedView style={styles.fullPage}>
                    <View style={styles.loadingContainer}>
                        <ThemedText>Loading friend requests...</ThemedText>
                    </View>
                </ThemedView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ThemedView style={styles.fullPage}>
                <View style={styles.topTab}>
                    <View style={{flex: 1}}/>
                    <View style={styles.userInfo}>
                        <ThemedText style={styles.userInfo} type="title">
                            Friend Requests {friendRequests.length > 0 ? `(${friendRequests.length})` : ''}
                        </ThemedText>
                    </View>
                    <View style={{ flex: 1, alignContent: 'flex-end', alignItems: 'flex-start', flexWrap: 'wrap'}}/>
                </View>
                
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                <View>
                {friendRequests.requestInfo.length > 0 ? (
                        friendRequests.profiles.map((request) => (
                            <FriendRequestComponent
                                key={request.id}
                                friend={request}
                                onAccept={() => handleAcceptRequest(request.id)}
                                onDecline={() => handleDeclineRequest(request.id)}
                            />
                     ))
                    ) : (
                    <View style={styles.noRequestsContainer}>
                        <ThemedText style={styles.noRequestsText}>
                            No pending friend requests
                        </ThemedText>
                    </View>
                )}
                </View>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() => navigator.replace('index')}
                    >
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    fullPage: {
        flex: 1,
    },
    refreshButton:{
        justifyContent: 'center', 
        alignItems: 'center', 
        fontFamily: 'LexendDeca',
        paddingVertical: 8,
        paddingHorizontal: 5,
        borderRadius: 20,
        paddingRight:20,
        paddingLeft: 20,
        marginTop: 15,
        backgroundColor: '#0E7C7B',
        marginRight: 20,
        alignSelf: 'center',
    },
    refreshButtonText: {
        color: '#FFFFFF',
        fontFamily: 'LexendDeca',
        fontSize: 14,
    },
    topTab: {
        backgroundColor: "#541388",
        paddingTop: (StatusBar.currentHeight || 0) + 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 12,
        marginBottom: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    contentWrapper: {
        maxWidth: 400,
        width: Platform.select({
            web: 'auto',
            default: '100%'
        }),
        alignSelf: 'center',
        paddingHorizontal: 16,
    },
    userInfo: {
        fontFamily: 'LexendDeca',
        fontStyle: 'normal',
        fontWeight: '400',
        color: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noRequestsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    noRequestsText: {
        fontSize: 17,
        fontFamily: 'LexendDeca',
    },
    allSeenText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
        marginBottom: 10,
        fontFamily: 'LexendDeca',
    },
});