import { Animated, StatusBar, StyleSheet, View, Text, TextInput, Pressable, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react'
import IdkLogo from '@/components/Logo';
import { useNavigation } from 'expo-router';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function FeedScreen() {
    const navigator = useNavigation();
    const [username, setUsername] = useState('');
    const [fontsLoaded] = useFonts({
        'LexendDeca': require('@/assets/fonts/LexendDecaRegular.ttf'),
    });

    const handleBack = () => {
        navigator.goBack();
    };

    React.useEffect(() => {
        navigator.setOptions({ headerShown: false });
    }, [navigator]);

    const searchUser = () => {
        alert(`${username} searched!`);
    };

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
        gap: 10,
    },
    inputWrapper: {
        flex: 1,
        maxWidth: '70%',
    },
    searchText: {
        backgroundColor: '#5D47A0',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 16,
        color: '#FFFFFF',
        width: '100%',
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
    },
});