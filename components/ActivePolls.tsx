import React, { useState, useEffect } from 'react';

import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { ThemedText } from './ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fakeuser } from './Types';

// Get screen dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const getRandomEmoji = () => {
  const emojis = [
    '✨', '💫', '⭐', '🌟', '⚡', '🎵', '🎶', '🎪', '🎨', '🎭', '🎪',
    '🎲', '🎮', '🎯', '🎳', '🎱', '🏆', '🎖️', '🎪', 
    '💭', '💡', '📌', '🎈', '🎁', '🎀', '💝', '🔮', '📱', '💻',
    '🌈', '☀️', '🌙', '⭐', '🌟', '🍀', '🌺', '🌸', '🌼', '🌻',
    '❤️', '💖', '💗', '💓', '💕', '😊', '🥳', '🤔', '🤩', '😎',
    '🎨', '🎭', '🎸', '🎺', '🎷', '🎻', '🎹', '🎼',
    '✨', '💫', '🌟', '🔮', '🎭', '🧙‍♂️', '🦄', '🌈',
    '💻', '📱', '💬', '📢', '🔍', '📈', '📊', '💡',
    '🎉', '🎊', '🎈', '🎪', '🎯', '🎰', '🎲', '🎮',
    '💯', '🔥', '💫', '✨', '⚡', '💥', '💢', '💦'
  ];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

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

const ActivePoll = ({ poll_id, pollData, userId }) => {
  const [voted, setVoted] = useState(false);
  const [results, setResults] = useState({});
  const [pollEmoji] = useState(getRandomEmoji());

  useEffect(() => {
    if(pollData?.options){
      // Check if the user has already voted on this specific poll
      const hasVoted = pollData.options.some(option => option.user === userId
      );
      
      if (hasVoted) {
        setVoted(true);
      }
  
      const initialResults = {};
      pollData.options.forEach((option) => {
        initialResults[option.option_text] = option.votes; 
      });
      setResults(initialResults);
    }
  }, [pollData, userId]);

  const handleVote = async (optionText, optionId) => {
    if (!voted && poll_id) {
      console.log('Vote Payload:', {
        poll: poll_id,
        option: optionId,
        user: userId
      });
      try {
        // Simulate vote on the front end (update local results)
        setResults((prev) => ({
          ...prev,
          [optionText]: (prev[optionText] || 0) + 1,
        }));
        setVoted(true);
  
        // Send vote to the backend
        const response = await fetch('https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/create/vote/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            poll: poll_id,
            option: optionId,  
            user: userId,     
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to submit vote');
        }
  
        const data = await response.json();
        console.log('Vote successfully submitted:', data);
      } catch (error) {
        console.error('Error submitting vote:', error);
      }
    }
  };

  const totalVotes = Object.values(results).reduce((a, b) => a + b, 0);

  // If pollData is not loaded yet, show a loading state
  if (!pollData) {
    return <ThemedText>Loading...</ThemedText>;
  }

  const { title, options } = pollData;

  // If no options are available, return null
  if (!options || options.length === 0) {
    return null;
  }

  return (
  <View style={styles.maxWidthContainer}>
    <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{pollEmoji}</Text>
          <Text style={styles.title}>{title || 'Untitled Poll'}</Text>
        </View>
        <View style={styles.content}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.option_id}
              onPress={() => handleVote(option.option_text, option.option_id)}
              disabled={voted}
              style={[
                styles.optionButton,
                { 
                  backgroundColor: voted ? '#CB046B' : '#CB046B', 
                  opacity: voted ? 0.7 : 1 
                }
              ]}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>
                  {option.option_text}
                  {voted && (
                    <Text style={styles.percentageText}>
                      {` (${Math.round(
                        (results[option.option_text] / totalVotes) * 100 || 0
                      )}%)`}
                    </Text>
                  )}
                </Text>
                {voted && (
                  <View
                    style={[
                      styles.votedOverlay,
                      { 
                        width: `${(results[option.option_text] / totalVotes) * 100 || 0}%`,
                      }
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1E9DA',
  },
  maxWidthContainer: {
    width: '100%',
    maxWidth: Platform.select({
      web: 600, 
      android: '90%' 
    }),
  },
  card: {
    backgroundColor: '#541388',
    borderRadius: 16,
    minHeight: Platform.OS === 'web' ? 400 : windowHeight * 0.6,
    maxHeight: Platform.OS === 'web' ? 600 : windowHeight * 0.8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 30,
    marginBottom: 20,
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
  },
  content: {
    gap: 10,
  },
  emoji: {
    fontSize: 40,
    textAlign: 'center',
  },
  optionButton: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#CB046B',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 10
  },
  optionContent: {
    zIndex: 10,
    position: 'relative',
  },
  optionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
  },
  percentageText: {
    fontSize: 12,
  },
  votedOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#900048',
    opacity: 0.3,
    zIndex: 1,
  },
});

export default ActivePoll;