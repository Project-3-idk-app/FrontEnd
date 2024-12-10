import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, View, Text, ActivityIndicator,FlatList, TouchableOpacity,} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import IdkLogo from '@/components/Logo';
import ActivePoll from '@/components/ActivePolls';
import { fakeuser } from '@/components/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FeedScreen() {
  const navigator = useNavigation();
  const [isEndOfList, setIsEndOfList] = useState(false);
  const [user, setUser] = useState(fakeuser);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
          console.log("User ID:", user.id);
      }

    const fetchPolls = async () => {
      try {
        const response = await fetch(`https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/polls/${user.id}/`);
        const data = await response.json();
        setPolls(data.polls); // API returns active polls directly
        setLoading(false);
      } catch (error) {
        console.error('Error fetching polls:', error);
        setError('Error fetching polls: ' + (error.message || 'Unknown error'));
        setLoading(false);
      }
    };
    fetchPolls();
  };
    fetchUser();
  }, []);

  const renderPollItem = ({ item }) => (
    <View style={styles.pollContainer}>
      <ActivePoll poll_id={item.poll_id} pollData={item} userId={user.id}/>
    </View>
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  };

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
          <FlatList
            data={polls}
            renderItem={renderPollItem}
            keyExtractor={(item) => item.poll_id.toString()}
            pagingEnabled={true}
            showsVerticalScrollIndicator={false}
            snapToInterval={SCREEN_HEIGHT *0.8}
            snapToAlignment="start"
            decelerationRate="fast"
            viewabilityConfig={viewabilityConfig}
            contentContainerStyle={styles.pollList}
            onEndReached={() => setIsEndOfList(true)}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={
              <Text style={styles.errorText}>No active polls available</Text>
            }
            ListFooterComponent={
              isEndOfList && polls.length > 0 ? (
                <View style={styles.endOfListContainer}>
                  <Text style={styles.endOfListText}>All Polls Seen</Text>
                </View>
              ) : null
            }
          />  
        )}
        <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => navigator.replace('index')}
              >
              <Text style={styles.addButtonText}>Refresh</Text>
          </TouchableOpacity>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fullPage: {
    flex: 1,
  },
  endOfListContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endOfListText: {
    fontFamily: 'LexendDeca',
    color: '#CB046B', 
    fontSize: 17,
  },
  topTab: {
    backgroundColor: "#CB046B",
    paddingTop: (StatusBar.currentHeight || 0),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    zIndex: 1,
  },
  refreshButton:{
    justifyContent: 'center', 
    alignItems: 'center', 
    fontFamily: 'LexendDeca',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 20,
    paddingRight:20,
    paddingLeft: 20,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#0E7C7B',
    marginRight: 20,
    alignSelf: 'center',
  },
  pollContainer: {
    height: SCREEN_HEIGHT *0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollList: {
    minHeight: '100%',
  },
  loader: {
    marginTop: 32,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontFamily: 'LexendDeca',
    fontSize: 14,
},
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 32,
    fontFamily: 'LexendDeca',
    fontSize: 20, 
  },
});