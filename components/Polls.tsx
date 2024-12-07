import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Platform, Pressable } from 'react-native';
import {Poll, } from '@/components/Types'

// Properties you pass in, onButtonPress is a function from (tabs)/user/index.tsx
type PollCardProps = {
    poll: Poll,
    onButtonPress: (pollId: number) => void;
};

// Used In User to horizontally scroll polls.
const PollCard: React.FC<PollCardProps> = ({ poll, onButtonPress }) => {
    return (
        <View style={styles.card}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={styles.cardTitle}>{poll.pollTitle}</Text>
                <Pressable onPress={() => onButtonPress(poll.pollId)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Image source={require('@/assets/images/close_ring.png')} style={styles.image} />
                    </View>
                </Pressable>
            </View>
            {poll.options.map((option, index) => {
                const percentage = (option.votes / poll.pollVotes) * 100;
                // const friendPercent = (option.friendVoteNum / poll.pollVotes) * 100;
                return (
                    <View key={index} style={styles.optionContainer}>
                        <Text style={styles.optionTitle}>{option.option}</Text>
                        <View style={styles.barBackground}>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        width: `${percentage}%`,
                                        backgroundColor: getBarColor(index),
                                    },
                                ]}
                            />
                            {/* <View
                                style={[
                                    styles.bar,
                                    {
                                        width: `${friendPercent}%`,
                                        backgroundColor: '#CB046B',
                                        marginVertical: 5
                                    },
                                ]}
                            /> */}
                        </View>
                        <Text style={styles.optionVoteText}>{`${percentage.toFixed(
                            1
                        )}%`}</Text>
                        {/* <Text style={styles.optionFriend}>{`${friendPercent.toFixed(
                            1
                        )}%`}</Text> */}
                    </View>
                );
            })}
        </View>
    );
};

// Function to generate different colors for bars
const getBarColor = (index: number) => {
    const colors = ['#4CAF50', '#FF9800', '#F44336', '#2196F3'];
    return colors[index % colors.length];
};

export const PollScroll: React.FC<{ polls: Poll[], onButtonPress:(pollId: number) => void }> = ({ polls, onButtonPress}) => {
    return (
        <ScrollView horizontal contentContainerStyle={styles.scrollView}>
            {polls.map((poll) => (
                <PollCard key={poll.pollId} poll={poll} onButtonPress={onButtonPress}/>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    card: {
        width: 300,
        marginRight: 20,
        backgroundColor: '#541388',
        borderRadius: 25,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,

    },
    cardTitle: {
        flex: 8,
        flexWrap: 'wrap',
        fontSize: 18,
        marginBottom: 10,
        color: "#FFF",
        fontFamily: 'LexendDeca'
    },
    optionContainer: {
        marginBottom: 25,
    },
    optionTitle: {
        fontSize: 16,
        marginBottom: 5,
        color: "#FFF",
        fontFamily: 'LexendDeca'
    },
    barBackground: {
        height: 12,
        width: '100%',
        backgroundColor: '#541388',
        borderRadius: 5,
    },
    bar: {
        height: '100%',
        borderRadius: 5,
    },
    optionVoteText: {
        position: 'absolute',
        right: 10,
        fontSize: 15,
        color: "#FFF",
        fontFamily: 'LexendDeca'
    },
    optionFriend: {
        position: 'absolute',
        right: 10,
        fontSize: 15,
        top: 30,
        color: "#FFF",
        fontFamily: 'LexendDeca',
        backgroundColor: '#CB046B',
        padding: 3,
        borderRadius: 10
    },
    image: {
        width: Platform.OS === "web" ? 50 : 40,
        height: Platform.OS === "web" ? 50 : 40,
    }
});

export default PollScroll;
