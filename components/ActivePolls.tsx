import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ActivePoll = ({ poll_id }) => {
  const [pollData, setPollData] = useState(null);
  const [voted, setVoted] = useState(false);
  const [results, setResults] = useState({});

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const response = await fetch('https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/');
        const data = await response.json();

        // Find the specific poll
        const poll = data.polls.find(p => p.poll_id === poll_id);
        
        // Find options for this specific poll
        const pollOptions = data.options.filter(option => option.poll === poll_id);

        if (poll) {
          // Combine poll and options
          const fullPollData = {
            ...poll,
            options: pollOptions
          };

          setPollData(fullPollData);

          // Initialize results based on options
          const initialResults = {};
          pollOptions.forEach((option) => {
            initialResults[option.option_text] = 0;
          });
          setResults(initialResults);
        }
      } catch (error) {
        console.error('Error fetching poll data:', error);
      }
    };

    if (poll_id) {
      fetchPollData();
    }
  }, [poll_id]);

  const handleVote = async (optionText, optionId) => {
    if (!voted && poll_id) {
      try {
        // Simulate vote on the front end (update local results)
        setResults((prev) => ({
          ...prev,
          [optionText]: (prev[optionText] || 0) + 1,
        }));
        setVoted(true);
  
        // Send vote to the backend
        const userId = "2"; // replace this with the actual logged in user's ID
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
    return <Text>Loading...</Text>;
  }

  const { title, options } = pollData;

  // If no options are available, return null
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
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
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#541388',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    gap: 12,
  },
  optionButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#CB046B',
    position: 'relative',
    overflow: 'hidden',
  },
  optionContent: {
    zIndex: 10,
    position: 'relative',
  },
  optionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  percentageText: {
    fontSize: 14,
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