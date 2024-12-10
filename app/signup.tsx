import { Image, StyleSheet, Platform, TouchableOpacity, View, Text, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import IdkLogo from '@/components/Logo';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fakeuser } from '@/components/Types';
import { createUser, searchUsersBool } from '@/components/DataBaseFuncs';
import { useNavigation } from 'expo-router';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isMobileWeb = isWeb && width < 768;

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(fakeuser);
  const navigator = useNavigation();

  // when screen is focused on, get user info
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
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
              <Text style={[
                styles.welcomeText,
                isMobileWeb && styles.welcomeTextMobileWeb
              ]}>Welcome to</Text>
              <IdkLogo 
                fontSize={
                  Platform.select({
                    ios: 80,
                    android: 70,
                    web: isMobileWeb ? 50 : 80
                  })
                } 
              />
              <Text style={[
                styles.welcomeText,
                isMobileWeb && styles.welcomeTextMobileWeb
              ]}> {user.given_name}</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.usernameText}>Please enter a username</Text>
              <TextInput
                style={[
                  styles.inputBox,
                  isWeb && styles.inputBoxWeb,
                  isMobileWeb && styles.inputBoxMobileWeb
                ]}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.submitButton, isWeb && styles.submitButtonWeb]}
                onPress={usernameCheck}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
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
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: Platform.select({
      ios: 16,
      android: 16,
      web: isMobileWeb ? 16 : 32
    }),
  },
  contentContainer: {
    width: Platform.select({
      ios: '100%',
      android: '100%',
      web: isMobileWeb ? '100%' : '50%'
    }),
    maxWidth: 600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
  },
  welcomeText: {
    fontSize: Platform.select({
      ios: 80,
      android: 70,
      web: 80
    }),
    fontFamily: 'LexendDeca',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  welcomeTextMobileWeb: {
    fontSize: 40,
  },
  usernameText: {
    fontFamily: 'LexendDeca',
    color: 'white',
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  inputBox: {
    width: Platform.select({
      ios: '50%',
      android: '70%',
      web: '50%'
    }),
    minWidth: 200,
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
    textAlign: 'center',
  },
  inputBoxWeb: {
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.2)',
    outline: 'none',
  },
  inputBoxMobileWeb: {
    width: '80%',
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
  submitButtonWeb: {
    cursor: 'pointer',
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'LexendDeca',
    fontSize: 16,
    textAlign: 'center',
  },
});