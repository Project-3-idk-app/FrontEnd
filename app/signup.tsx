import { Image, StyleSheet, Platform, TouchableOpacity, View, Text, TextInput, } from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import IdkLogo from '@/components/Logo';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fakeuser } from '@/components/Types';
import { createUser, searchUsersBool } from '@/components/DataBaseFuncs';
import { useNavigation } from 'expo-router';

export default function SingUpScreen() {
  const [username, setUsername] = useState(''); // State for the TextInput value
  const [user, setUser] = useState(fakeuser);
  const navigator = useNavigation();


  // When screen is focused on, get User information
  useEffect(() => {
    const fetchUser = async () => {
      const temp = await AsyncStorage.getItem("@user");
      if (temp) {
        setUser(JSON.parse(temp));
        console.log("local user is: ", user);
      }
    };
    fetchUser();
  }, []);

  const usernameCheck = async () => {
    user.username = username;
    console.log(`user is `, user);
    let result = await searchUsersBool(username);
    if(result){
      let temp = await createUser(user);
      console.log(temp);
      if (temp != null) {
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        navigator.navigate('(tabs)');
      }
      else{
        alert("Error with Account Creation, please try again");
      }
    }
    else {
      alert("Error With Username, use a different username");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#C2066D', '#541388']}
        style={styles.gradientBackground}>
        <View>
          <IdkLogo fontSize={120} />

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={{ color: 'white' }}>Welcome to IDK {user.given_name}</Text>
            <Text style={{ color: 'white' }}>Please enter a username</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={username} // Bind value to state
              onChangeText={setUsername} // Update state on text change
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={usernameCheck}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inputContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  inputBox: {
    width: '80%',
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#541388',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
    fontSize: 16,
  },
});