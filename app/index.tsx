import * as React from 'react';
import { Image, StyleSheet, Platform, Text, Button, View, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useFonts } from 'expo-font';
import { useNavigation } from 'expo-router';
import { fakeuser, User } from '@/components/Types';
import IdkLogo from '@/components/Logo';
import { getUserInfoDb } from '@/components/DataBaseFuncs';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const navigator = useNavigation();
  // Load LexendDeca Font from Figma
  const [fontsLoaded] = useFonts({
    'LexendDeca': require('../assets/fonts/LexendDecaRegular.ttf'), 
  });

  // Request for Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '500822752579-mauavq9gc7vc5lsj0or9iusau4nselej.apps.googleusercontent.com',
    androidClientId: '500822752579-8u7s381ejd5l148t79v8od1jepd4jbn8.apps.googleusercontent.com',
    iosClientId: '',
    scopes: ['profile', 'email'],
  });

  // I'm working on saving the user info with these two functions from the video I'm watching, its not done yet 
  async function handleSignInWithGoogle() {
    let user = await AsyncStorage.getItem("@user");
    console.log("local storage currently has: ", JSON.parse(user));
    // if the user hasnt signed in
    if(!user)
    {
      if(response?.type === "success")
      {
        await getGoogleInfo(response.authentication?.accessToken);
        user = await AsyncStorage.getItem("@user");
        user = JSON.parse(user);
        console.log('user info for checking the database is ', user);
        let check = await getUserInfoDb(user.id);
        console.log("user info is", check)
        if(check == null) {
          // user doesnt exist in our db
          navigator.navigate('signup');
        }
        else {
          // user exists
          await AsyncStorage.setItem("@user", JSON.stringify(check));
          navigator.navigate('(tabs)')
        }

      }
    }
    else
    {
      // if the user has signed in
      navigator.navigate('(tabs)');
    }
  }

  const fakeSignIn = async () => {
    await AsyncStorage.setItem("@user", JSON.stringify(fakeuser));
    await handleSignInWithGoogle();
  }

  const getGoogleInfo = async (token: string | undefined) => {
    if(!token) return;
    console.log("attempting to fetch");
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );
      console.log("post fetch");
      let user = await response.json();
      console.log("post json change")
      user.username = 'none';
      await AsyncStorage.setItem("@user", JSON.stringify(user));
    } catch(error){
      // error handler
    }
  };

  // Use Handle Sign In With Google Function and get user info
  React.useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);


  // Display Buttons Based on Platform 
  const Component = Platform.select({
    // On Android, display this
    native: () => (
      <View style={styles.container}>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => {
          if (request) {
            promptAsync();
          } else {
            console.log('Google Auth request is not ready');
          }
        }}>
        <View style={styles.buttonContent}>
          {/* Google Logo */}
          <Image
            source={require('../assets/images/googlelogo.png')} 
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>Sign in</Text>
        </View>
      </TouchableOpacity>
    </View>
),
    // On Web, display the Google button
    default: () => (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            if (request) {
              promptAsync();
            } else {
              console.log('Google Auth request is not ready');
            }
          }}>
          <View style={styles.buttonContent}>
            {/* Google Logo */}
            <Image
              source={require('../assets/images/googlelogo.png')} 
              style={styles.googleLogo}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </View>
        </TouchableOpacity>
      </View>
  ),
  })();

  return (
    // Gradient Background and Logo 
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#C2066D', '#541388']}  
        style={styles.gradientBackground}>
        <View style={styles.textRow}>
        <IdkLogo fontSize={120}></IdkLogo>
      </View>
        {/* Google Button */}
        {Component}
        {/* Fake User Sign in for dev purposes */}
        <View style={styles.debugButtonContainer}>
          <TouchableOpacity
            style={styles.debugButton}
            onPress={() => fakeSignIn()}>
            <View style={styles.buttonContent}>
              <Text style={styles.googleButtonText}>Debug Sign in</Text>
            </View>
          </TouchableOpacity>
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
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 16,
  },
  textRow: {
    flexDirection: 'row',  
    alignItems: 'center',  
    padding: 30,
    marginTop: 170,
  },
  title: {
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 120,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',  
    textShadowOffset: { width: 0, height: 4 }, 
    textShadowRadius: 4, 
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black', 
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#000',
    marginTop: -70,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  debugButton:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black', 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    marginTop: -35,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  debugButtonContainer: {
    marginBottom: 300  
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  googleLogo: {
    width: 24, 
    height: 24, 
    marginRight: 10
  },
  googleButtonText: {
    color: '#fff',
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
  }
})