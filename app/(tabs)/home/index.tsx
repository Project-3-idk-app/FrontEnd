import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import IdkLogo from '@/components/Logo';
import ActivePoll from '@/components/ActivePolls';

export default function FeedScreen() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/polls/');
        const data = await response.json();
        setPolls(data); // API now returns active polls directly
        setLoading(false);
      } catch (error) {
        console.error('Error fetching polls:', error);
        setError('Error fetching polls: ' + (error.message || 'Unknown error'));
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const renderPollItem = ({ item }) => (
    <View style={styles.pollItem}>
      <ActivePoll poll_id={item.poll_id} />
    </View>
  );

  return (
    <ThemedView style={styles.fullPage}>
      <SafeAreaView style={styles.fullPage}>
        <View style={styles.topTab}>
          <View style={{ flex: 1 }} />
          <IdkLogo fontSize={50} />
          <View style={{ flex: 1, alignItems: 'flex-start' }} />
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#CB046B" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.container}>
            <FlatList
              data={polls}
              keyExtractor={(item) => item.poll_id.toString()}
              renderItem={renderPollItem}
              contentContainerStyle={styles.pollList}
              ListEmptyComponent={
                <Text style={styles.errorText}>No active polls available</Text>
              }
            />
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    fullPage: {
        flex: 1,
    },
    container:{
        flex: 1,
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
    pollList: {
        padding: 16,
    },
    pollItem: {
        padding: 16,
        marginBottom: 12,
        alignItems:'center',
    },
    pollTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    pollDetails: {
        fontSize: 14,
        color: '#666',
    },
    loader: {
        marginTop: 32,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 32,
    },
});