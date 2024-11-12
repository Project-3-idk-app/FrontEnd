import { Button, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router';
import { fakeuser } from '@/components/Types';

export default function UserScreen() {
    const navigator = useNavigation();
    const [user, setUser] = useState(fakeuser);

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

    const signout = async () => {
        try {
            await AsyncStorage.removeItem("@user");
            navigator.getParent()?.replace('index');
        } catch {
            console.log("Error with signing out");
        }
    }

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
    return (
        <ThemedView style={styles.fullPage}>
            <View style={{ backgroundColor: "#CB046B", flex: 1, height: 10}}>
                    <ThemedText type="title">Welcome, your already signed in.</ThemedText>
            </View>
                <ThemedView style={styles.titleContainer}>
                </ThemedView>
                <ThemedView style={styles.body}>
                    <ThemedText type="subtitle">Hello User: {user.username}</ThemedText>
                    <ThemedText type="subtitle">Given Name: {user.given_name}</ThemedText>
                    <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{ display: 'flex', flex: 1, margin: 10 }}/>
                        <View style={{ display: 'flex', flex: 1, margin: 10 }}>
                            <Button title='Sign Out' onPress={() => signout()} />
                        </View>
                        <View style={{ display: 'flex', flex: 1, margin: 10}}/>
                    </View>
                </ThemedView>
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
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
