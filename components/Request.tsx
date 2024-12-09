import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

const FriendRequestComponent = ({ friend, onAccept, onDecline }) => {
    return (
        <View style={styles.outerContainer}>
            <View style={styles.maxWidthContainer}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Image 
                            source={{ uri: friend.picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + friend.username }} 
                            style={styles.avatar}
                        />
                        <ThemedText style={styles.text}>
                            {friend.username} sent you a friend request
                        </ThemedText>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, styles.acceptButton]} 
                            onPress={() => onAccept(friend.userId)}
                        >
                            <ThemedText style={styles.buttonText}>Accept</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.button, styles.declineButton]} 
                            onPress={() => onDecline(friend.userId)}
                        >
                            <ThemedText style={styles.buttonText}>Decline</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.separator} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    maxWidthContainer: {
        width: '100%',
        maxWidth: Platform.select({
            web: 800,
            default: '100%'
        }),
        position: 'relative',
    },
    container: {
        padding: 15,
        width: '100%',
        display: 'flex',
        alignItems: 'center', 
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
        maxWidth: 600, 
        alignSelf: 'center', 
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#E0E0E0',
        flexShrink: 0, 
    },
    text: {
        fontSize: 16,
        flex: 1,
        fontFamily: 'LexendDeca',
        fontStyle: 'normal',
        fontWeight: '400',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center', 
        gap: 10,
        width: '100%',
        maxWidth: 600, 
        alignSelf: 'center', 
        paddingLeft: 50, 
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 15,
        minWidth: 80,
        alignItems: 'center',
        marginBottom: 10
    },
    acceptButton: {
        backgroundColor: '#2E7D32',
    },
    declineButton: {
        backgroundColor: '#C62828',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        maxWidth: '100%',
    },
});

export default FriendRequestComponent;