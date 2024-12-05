import { Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { fakeFriendRequests, fakeuser } from '@/components/Types';
import FriendRequestComponent from '@/components/Request';

export default function FeedScreen() {
    const [currentUser, setCurrentUser] = useState(fakeuser);
    const [friendRequests, setFriendRequests] = useState(fakeFriendRequests);
    const [loading, setLoading] = useState(true);

    const [fontsLoaded] = useFonts({
        'LexendDeca': require('@/assets/fonts/LexendDecaRegular.ttf'),
    });

    const getUserFromStorage = async () => {
        try {
            const userStr = await AsyncStorage.getItem("@user");
            if (userStr) {
                return JSON.parse(userStr);
            }
            return null;
        } catch (error) {
            console.error("Error getting user from AsyncStorage:", error);
            return null;
        }
    };

    const fetchFriendRequests = async (userId) => {
        let temp = [];
        try{
            // TODO: get the requests that are pending to send them to the top

        } catch (error) {
            console.error("notifs friendFetch: ", error);
        }


        setLoading(false);
    };

    const handleAcceptRequest = async (friendId) => {

        // Remove the accepted request from the list
        setFriendRequests(prev => 
            prev.filter(request => request.userId !== friendId)
        );
        console.log(`Accepted friend request from user ${friendId}`);
    };

    const handleDeclineRequest = async (friendId) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove the declined request from the list
        setFriendRequests(prev => 
            prev.filter(request => request.userId !== friendId)
        );
        console.log(`Declined friend request from user ${friendId}`);
    };

    // When screen is focused on, get User information
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await AsyncStorage.getItem("@user");
                const user = JSON.parse(data);
                if (user) {
                    setCurrentUser(user);
                    await fetchFriendRequests(user.id);
                }
            } catch (error) {
                let temp = currentUser;
                temp.id = '-1'
                setCurrentUser(temp);
                console.error("Error getting user from AsyncStorage", error);
            }
        };
        fetchUser();
        console.log('addFriend.tsx: ' + JSON.stringify(user));
    }, []);
    if (!fontsLoaded) {
        return null;
    }

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
            <ThemedView style={[styles.fullPage, { backgroundColor: '#FAF3E3' }]}>
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
                    {friendRequests.length > 0 ? (
                        friendRequests.map((request) => (
                            <FriendRequestComponent
                                key={request.id}
                                friend={request}
                                onAccept={() => handleAcceptRequest(request.userId)}
                                onDecline={() => handleDeclineRequest(request.userId)}
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
        fontSize: 16,
        color: '#666',
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