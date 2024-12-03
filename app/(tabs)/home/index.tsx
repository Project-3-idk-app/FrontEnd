import { Animated, StatusBar, StyleSheet, View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react'
import IdkLogo from '@/components/Logo';

export default function FeedScreen() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchPolls = async () => {
    //       try {
    //         const response = await .get('/getAllItems/');
    //         console.log(response.data);
    //         setPolls(response.data);
    //         setLoading(false);
    //       } catch (error) {
    //         console.error('Error fetching products:', error.response?.data);
    //         setError('Error fetching products: ' + (error.response?.data?.message || error.message));
    //         setLoading(false);
    //       }
    //     };
    
    //     fetchPolls();
    //   }, []);
    
    return (
        <ThemedView style={styles.fullPage}>
            <SafeAreaView>
            <View style={styles.topTab}>
                <View style={{flex: 1}}/>
                <IdkLogo fontSize={50}></IdkLogo>
                <View style={{ flex: 1, alignContent: 'flex-end', alignItems: 'flex-start'}}>
                </View>
            </View>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    fullPage: {
        flex: 1
    },

    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    body: {
        gap: 8,
        marginBottom: 8,
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
});
