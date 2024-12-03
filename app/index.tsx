import * as React from 'react';
import { Image, StyleSheet, Platform, Text, Button, View, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useFonts } from 'expo-font';
import { useNavigation } from 'expo-router';
import { fakeuser } from '@/components/Types';
import IdkLogo from '@/components/Logo';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const navigator = useNavigation();
  // Load LexendDeca Font from Figma
  const [fontsLoaded] = useFonts({
    'LexendDeca': require('../assets/fonts/LexendDecaRegular.ttf'), 
  });

  //Initialize User Info Variables 
  const [userInfo, setUserInfo] = React.useState(null);

  // Request for Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '500822752579-mauavq9gc7vc5lsj0or9iusau4nselej.apps.googleusercontent.com',
    androidClientId: '500822752579-8u7s381ejd5l148t79v8od1jepd4jbn8.apps.googleusercontent.com',
    iosClientId: '',
    scopes: ['profile', 'email'],
  });

  // I'm working on saving the user info with these two functions from the video I'm watching, its not done yet 
  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem("@user");
    console.log(JSON.parse(user));
    // if the user has never signed in
    if(!user)
    {
      if(response?.type === "success")
      {
        await getUserInfo(response.authentication?.accessToken);
        // TODO: check with our database to see if this user already exists: if not, create username, else go to tabs
        navigator.navigate('(tabs)');
      }
    }
    else
    {
      setUserInfo(JSON.parse(user));
      navigator.navigate('(tabs)');
    }
  }

  const fakeSignIn = async () => {
    await AsyncStorage.setItem("@user", JSON.stringify(fakeuser));
    await handleSignInWithGoogle();
  }

  const getUserInfo = async (token: string | undefined) => {
    if(!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );
      let user = await response.json();
      user.username = 'none';
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
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
        <View>
          <TouchableOpacity
            style={styles.googleButton}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  textRow: {
    flexDirection: 'row',  
    alignItems: 'center',  
    padding: 30,
    marginTop: 100 
  },

  title: {
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 120,
    color: '#FFFFFF',
    marginTop: 170,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',  
    textShadowOffset: { width: 0, height: 4 }, 
    textShadowRadius: 4, 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: -300,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
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