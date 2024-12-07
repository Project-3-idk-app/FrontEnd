import { Button, Image, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router';
import {fakeuser } from '@/components/Types';
import { useFonts } from 'expo-font';
import FriendComponent from '@/components/Friend';

export default function FeedScreen() {
    const navigator = useNavigation();
    const [user, setUser] = useState(fakeuser);
    const [friends, setFriends] = useState([]);
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
            setFriends([
                { id: 1, username: 'JustNekoChris' },
                { id: 2, username: 'DaSpeedSta' },
                { id: 3, username: 'HappyFunBuns' },
            ]);
        }
    };

    fetchUser();
    console.log(JSON.stringify(user, null, 2));
}, []);

const handleUnfollow = (friendId) => {
    alert(`Unfollowing friend with ID:', ${friendId}`);
};

const handleAddFriend = () => {
    // Add friend functionality here
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
                        <Pressable
                            style={styles.addButton}
                            onPress={handleAddFriend}
                        >
                            <Text style={styles.addButtonText}>+ Add Friend</Text>
                        </Pressable>
                    </View>
            
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                {friends.map((friend) => (
                    <FriendComponent
                        key={friend.id}
                        friend={friend}
                        onUnfollow={handleUnfollow}
                    />
                ))}
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
