import { Animated, StatusBar, StyleSheet, View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'
import IdkLogo from '@/components/Logo';

export default function FeedScreen() {
    return (
        <ThemedView style={styles.fullPage}>
            <SafeAreaView>
            <View style={styles.topTab}>
                <View style={{flex: 1}}/>
                <IdkLogo fontSize={50}></IdkLogo>
                <View style={{ flex: 1, alignContent: 'flex-end', alignItems: 'flex-start'}}>
                </View>
            </View>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    fullPage: {
        flex: 1
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
      
    topTab: {
        backgroundColor: "#CB046B",
        paddingTop: (StatusBar.currentHeight || 0),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
});
