import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';

//export type User = {
// id: string;
// username: string;
// email: string;
// picture: string;
// }
const FriendComponent = ({friend, onUnfollow }) => {
  return (
    <View style={styles.container}>
    <View style={styles.maxWidthContainer}>
        <View style={friend.pending ? styles.pendingContainer : styles.friendContainer}>
          <View style={styles.avatarContainer}>
            <Image source={friend.picture} style={styles.avatar} />
            <Text style={styles.username}>{friend.username}</Text>
          </View>
          {friend.pending ? 
            <Text style={styles.unfollowText}>Friend Pending</Text> 
            :
            <TouchableOpacity
            style={styles.unfollowButton}
            onPress={() => onUnfollow(friend.id)}
            >
              <Text style={styles.unfollowText}>Unfollow</Text>
            </TouchableOpacity>
          }
      </View>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center', 
  },
  maxWidthContainer: {
    width: '100%',
    maxWidth: Platform.select({
      web: 750, 
      android: '100%' 
    }),
  },
  friendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#541388',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  pendingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#CB046B',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 12,
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
    fontSize: 18,
  },
  unfollowButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  unfollowText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
    fontSize: 16,
  },
});

export default FriendComponent;