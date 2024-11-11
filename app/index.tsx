import * as React from 'react';
import { Image, StyleSheet, Platform, Text, Button, View, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useFonts } from 'expo-font';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  // Load LexendDeca Font from Figma
  const [fontsLoaded] = useFonts({
    'LexendDeca': require('../assets/fonts/LexendDecaRegular.ttf'), 
  });

  //Initialize User Info Variables 
  const [userInfo, setUserInfo] = React.useState(null);

  // Request for Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '500822752579-mauavq9gc7vc5lsj0or9iusau4nselej.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  React.useEffect(() => {
    if (response?.type === 'success') 
    {
      const { authentication } = response;
      console.log('Authentication successful', authentication);
      // save user info 
    } 
    else if (response?.type === 'error') 
    {
      console.log('Authentication error', response);
    }
  }, [response]);

  // Flashing Text Function for idk Bar in Logo 
  const flashingTextOpacity = React.useRef(new Animated.Value(2)).current; 
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashingTextOpacity, 
        {
          toValue: 0, // fade out
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(flashingTextOpacity, {
          toValue: 1, // fade in
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [flashingTextOpacity]);

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
        }}
      >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
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
        <Text style={styles.title}>idk</Text>
        <Animated.Text style={[styles.flashingText, { opacity: flashingTextOpacity }]}>
          |
        </Animated.Text>
      </View>
    {/* Google Button */}
        {Component}
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
  },
  flashingText: {
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
    fontSize: 50,
    transform: [{ scaleY: 2 }],
    color: '#FFFFFF',
    marginTop: 145,
    fontWeight: 'bold',
  },
  title: {
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 120,
    lineHeight: 40, 
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