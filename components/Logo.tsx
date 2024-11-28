import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

type IdkLogoProps = {
  fontSize?: number; // Optional prop to customize the font size
};

const IdkLogo: React.FC<IdkLogoProps> = ({ fontSize = 120 }) => {
  const flashingTextOpacity = React.useRef(new Animated.Value(1)).current;

  // Flashing animation logic
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashingTextOpacity, {
          toValue: 0, // Fade out
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(flashingTextOpacity, {
          toValue: 1, // Fade in
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [flashingTextOpacity]);

  return (
    <View style={styles.textRow}>
      <Text style={[styles.title, { fontSize }]}>{`idk`}</Text>
      <Animated.Text style={[styles.flashingText, { opacity: flashingTextOpacity, fontSize: fontSize * 0.4 }]}>
        |
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  flashingText: {
    fontFamily: 'LexendDeca',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 5, // Adds spacing between "idk" and "|"
    transform: [{ scaleY: 2 }], // Taller vertical scaling
  },
});

export default IdkLogo;
