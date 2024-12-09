import { Button, Image, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router';
import {fakeuser, friendStatus, showAlert } from '@/components/Types';
import { useFonts } from 'expo-font';
import FriendComponent from '@/components/Friend';
import { deleteFriend, getNotifications, getUserFriends, getUserInfoDb } from '@/components/DataBaseFuncs';

export default function FeedScreen() {
    const navigator = useNavigation();
    const [user, setUser] = useState(fakeuser);
    // friendInfo contains ids and status, profiles contains an array of type User
    const [friends, setFriends] = useState({friendInfo: [], profiles: [] });
    // This has the username, and pfp of who their friends are
    const [fontsLoaded] = useFonts({
        'LexendDeca': require('@/assets/fonts/LexendDecaRegular.ttf'), 
      });

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

useEffect(() => {
    const fetchUser = async () => {
        const user = await getUserFromStorage();
        if (user) {
            setUser(user);
            try{
                let data = {
                    friendInfo: [],
                    profiles: []
                }
                // TODO: add the pending friendrequests to the start of this array
                let notifs = await getNotifications(user.id);
                if (notifs) {
                    // need to filter pending requests
                    console.log('filtering');
                    const filteredData = notifs.filter(item => item.status === friendStatus.SENT);
                    data.friendInfo = data.friendInfo.concat(filteredData);
                    for (let i of filteredData) {
                        let profile = await getUserInfoDb(i.user_id2);
                        profile.pending = true;
                        data.profiles.push(profile);
                    }
                }
                // Get Friends that already exist
                let existingFriends = await getUserFriends(user.id);
                if (existingFriends) {
                    data.friendInfo = data.friendInfo.concat(existingFriends);
                    for(let i of existingFriends) {
                        let profile = await getUserInfoDb(i.user_id2);
                        data.profiles.push(profile);
                    }
                    console.log('friends: we got back', data);
                    setFriends(data);
                    console.log('friend list is ', friends);
                }
            } catch (error) {
                console.log('friends: Error', error);
                setFriends({ friendInfo: [], profiles: [] });
            }

        }
    };

    fetchUser();
    console.log(JSON.stringify(user, null, 2));
}, []);

const handleUnfollow = async (friendId) => {
    try{
        let data = await deleteFriend(user.id, friendId);
        if(data){
            navigator.replace('index');
        }
    } catch (error) {
        console.log('friends: Error', error);
        showAlert('Error', 'Error with removing friend');
    }
};

const handleAddFriend = () => {
    navigator.navigate('addFriend');
};

    return (
        <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.fullPage}>
            <View style={styles.topTab}>
                <View style={{flex: 1}}/>
                <View style={styles.userInfo}>
                    <ThemedText style={styles.userInfo} type="title">{user.username}'s Friends</ThemedText>
                </View>
                
                <View style={{ flex: 1, alignContent: 'flex-end', alignItems: 'flex-start', flexWrap: 'wrap'}}/>
            </View>
            <View style={styles.addButtonContainer}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => navigator.navigate('addFriend')}
                        >
                            <Text style={styles.addButtonText}>+ Add Friend</Text>
                        </TouchableOpacity>
                    </View>
            
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                {friends && friends.profiles.length > 0 ?
                    friends.profiles.map((friend) => (
                        <FriendComponent
                            key={friend.id}
                            friend={friend}
                            onUnfollow={handleUnfollow}
                        />
                    )) :
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <ThemedText style={styles.noFriendsText}>You have no friends, invite some to the app!</ThemedText>
                    </View>
                }
                
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() => navigator.replace('index')}
                    >
                    <Text style={styles.addButtonText}>Refresh</Text>
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
    noFriendsText:{
        fontSize: 17
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
        paddingHorizontal: 16,
        paddingBottom: 20,
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
    image: {
        width: Platform.OS === "web" ? 100 : 50, 
        height: Platform.OS === "web" ? 100 : 50,
    },
    setting: {
        width: Platform.OS === "web" ? 50 : 25,
        height: Platform.OS === "web" ? 50 : 25,
    },
    addButtonContainer: {
        alignItems: 'flex-end',
        marginBottom: 18,
    },
    addButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#665DB7',
        marginRight: 20,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontFamily: 'LexendDeca',
        fontSize: 14,
    },
});
