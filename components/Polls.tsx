import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Platform, Pressable } from 'react-native';
import { Poll } from '@/components/Types';

type PollCardProps = {
    poll: Poll,
    onButtonPress: (pollId: number) => void;
};

const PollCard: React.FC<PollCardProps> = ({ poll, onButtonPress }) => {
    const cardHeight = poll.options.length === 2 ? 200 : poll.options.length === 3 ? 250 : 300;
    return (
        <View style={[styles.card, {height:cardHeight}]}>
            <View style={{ position: 'relative' }}>
                <Pressable onPress={() => onButtonPress(poll.pollId)} style={styles.closeButton}>
                    <Image source={require('@/assets/images/close_ring.png')} style={styles.image} />
                </Pressable>
                <Text style={styles.cardTitle}>{poll.pollTitle}</Text>
            </View>
            <View style={styles.allOptions}>
            {poll.options.map((option, index) => {
                let percentage = (option.votes / poll.pollVotes) * 100;
                if (poll.pollVotes === 0) {
                    percentage = 0.0;
                }
                return (
                    <View key={index} style={styles.optionContainer}>
                        <Text style={styles.optionTitle}>{option.option}</Text>
                        <View style={styles.barContainer}>
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
                            </View>
                            <Text style={styles.optionVoteText}>{`${percentage.toFixed(1)}%`}</Text>
                        </View>
                    </View>
                );
            })}
            </View>
        </View>
    );
};

// Function to generate different colors for bars
const getBarColor = (index: number) => {
    const colors = ['#4CAF50', '#FF9800', '#F44336', '#2196F3'];
    return colors[index % colors.length];
};

export const PollScroll: React.FC<{ polls: Poll[], onButtonPress: (pollId: number) => void }> = ({ polls, onButtonPress }) => {
    return (
        <ScrollView horizontal contentContainerStyle={styles.scrollView}>
            {polls.map((poll) => (
                <PollCard key={poll.pollId} poll={poll} onButtonPress={onButtonPress} />
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
        flexDirection: 'column',
    },
    closeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        zIndex: 1,
    },
    allOptions:{
        alignItems:'center'
    },
    cardTitle: {
        flex: 1,  
        fontSize: 18,
        marginBottom: 10,
        color: "#FFF",  
        fontFamily: 'LexendDeca',
        flexWrap: 'wrap',  
    },
    
    optionTitle: {
        fontSize: 15,
        marginBottom: 5,
        color: "#FFF", 
        fontFamily: 'LexendDeca',
        flexWrap: 'wrap',  
    },
    optionContainer: {
        flexDirection: 'column',
        marginBottom: 25,
        width: '100%',
    },
    
    barContainer: {
        flexDirection: 'row', 
        alignItems: 'center',  
        width: '100%',  
    },
    barBackground: {
        height: 12,
        width: '80%',  
        backgroundColor: '#541388',
        borderRadius: 5,
    },
    bar: {
        height: '100%',
        borderRadius: 5,
    },
    optionVoteText: {
        fontSize: 15,
        color: "#FFF",
        fontFamily: 'LexendDeca',
        marginLeft: 10, 
        width: '20%', 
    },
    image: {
        width: Platform.OS === "web" ? 30 : 40,
        height: Platform.OS === "web" ? 30 : 40,
    },
});

export default PollScroll;
