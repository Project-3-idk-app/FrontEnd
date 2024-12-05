import { StyleSheet, View, Text, TouchableOpacity, TextInput, Dimensions, Platform, Image, StatusBar } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import user from '../user';

// Get screen dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FeedScreen() {
    const [question, setQuestion] = useState(''); 
    const [choices, setChoices] = useState(['','']);
    const [loading, setLoading] = useState(false);

    const addChoice = () => {
        if(choices.length < 4){
            setChoices([...choices, '']); 
        }
    }

    const clearPoll = () => {
        setQuestion(''); 
        setChoices(['', '']); 
    }

    const updateChoice = (index, value) =>{
        const updatedChoices = [...choices];
        updatedChoices[index] = value;
        setChoices(updatedChoices); 
    }

    const removeChoice = (indexToRemove) => {
        if (choices.length > 2) {
            const updatedChoices = choices.filter((_, index) => index !== indexToRemove);
            setChoices(updatedChoices);
        }
    };

    const createPoll = async () => {
        try{
            const response = await fetch('https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/create/poll/',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: user.id,
                    title: question
                })
            });
            if(!response.ok){
                throw new Error('Failed to create poll');
            }
            const data = await response.json(); 
            return data.id; 
        } catch(error){
            console.error('Error creating poll:', error);
            throw error; 
        }
    };

    const createOption = async (pollId, optionText) => {
        try{
            const response = await fetch('https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/create/option/',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    poll: pollId,
                    option_text: optionText,
                    user: user.id
                })
            }); 
            if(!response.ok){
                throw new Error('Failed to create option');
            }

            return await response.json();
        } catch (error){
            console.error('Error creating option:', error);
            throw error;
        }
    };

    const submitPoll = async () => {
        if(choices.some(choice => choice === '') || question === ''){
            alert("Error: Cannot have an empty question or choice.");
            return; 
        }
        setLoading(true);
        try{
            const pollId = await createPoll();
            const optionPromises = choices.map(choice => createOption(pollId, choice));
            await Promise.all(optionPromises);
            alert("Poll Created Successfully!");
            clearPoll();
        } catch (error){
            alert("Error creating poll: " + error.message);
        } finally {
            setLoading(false);
        }
    }; 

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.fullPage}>
                <View style={styles.topTab}>
                    <View style={{flex: 1}}/>
                    <View style={styles.tabText}>
                        <ThemedText style={styles.tabText} type="title">Create a Poll</ThemedText>
                    </View>
                    <View style={{ flex: 1, alignContent: 'flex-end', alignItems: 'flex-start', flexWrap: 'wrap'}}>
                    </View>
                </View>
                <View style={styles.rectangle13}>
                    <TouchableOpacity onPress={clearPoll}>
                        <Image source={require('@/assets/images/close_ring.png')} style={styles.crossIcon}></Image>
                    </TouchableOpacity>
                    <View style={styles.group1}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.askQuestion}
                                placeholder="Ask a question ..."
                                placeholderTextColor="#FFFFFF"
                                value={question}
                                onChangeText={setQuestion}
                                multiline={true}
                                maxLength={32}/>
                        </View>
                    
                        <View style={styles.choicesContainer}>
                            {choices.map((choice, index) => (
                                <View key={index} style={styles.choiceContainer}>
                                    <TextInput
                                        style={[styles.choice, { flex: 1 }]}
                                        placeholder={`Choice ${index + 1} ...`}
                                        placeholderTextColor="#F1E9DA"
                                        value={choice}
                                        onChangeText={(text) => updateChoice(index, text)}
                                        maxLength={32}
                                    />
                                    {choices.length > 2 && (
                                        <TouchableOpacity 
                                            style={styles.removeChoiceButton}
                                            onPress={() => removeChoice(index)}
                                        >
                                            <Image 
                                                source={require('@/assets/images/close_ring.png')} 
                                                style={styles.removeChoiceIcon}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>

                        {choices.length < 4 && (
                            <TouchableOpacity style={styles.addOptionContainer} onPress={addChoice}>
                                <Image source={require('@/assets/images/Chat_plus.png')} style={styles.icon}></Image>
                                <Text style={styles.addAnotherOption}>Add Another Option</Text>
                            </TouchableOpacity>
                        )}

                        <Text style={styles.expires}>Expires in 24 hours</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.createPollButton} onPress={submitPoll}>
                    <LinearGradient
                        colors={['#541388', '#D90368']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.createPollButton}>
                        <Text style={styles.createPollText}>Create Poll</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1E9DA',
    },
    topTab: {
        width: '100%',
        backgroundColor: "#CB046B",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 45,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    tabText: {
        fontFamily: 'LexendDeca',
        fontStyle: 'normal',
        fontWeight: '400',
        color: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    fullPage: {
        flex: 1,
        alignItems: 'center',
    },
    rectangle13: {
        width: Platform.OS === 'web' ? Math.min(windowWidth * 0.85, 500) : windowWidth * 0.85,
        minHeight: Platform.OS === 'web' ? 400 : windowHeight * 0.6,
        maxHeight: Platform.OS === 'web' ? 600 : windowHeight * 0.8,
        borderColor: '#000',
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            },
            default: {
                shadowColor: 'rgba(0, 0, 0, 0.25)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 4,
            },
        }),
        borderRadius: 25,
        backgroundColor: '#665DB7',
        padding: 20,
    },
    group1: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    crossIcon: {
        width: 25,
        height: 25,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    askQuestion: {
        width: '90%',
        paddingTop:20,
        minHeight: 50,
        backgroundColor: '#5D47A0',
        borderRadius: 5,
        fontSize: 20,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    choicesContainer: {
        width: '90%',
        gap: 10,
        marginBottom: 20,
    },
    choiceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        width: '100%',
    },
    choice: {
        minHeight: 40,
        backgroundColor: '#BB146A',
        borderRadius: 5,
        paddingHorizontal: 15,
        fontSize: 15,
        color: '#F1E9DA',
        textAlign: 'center',
    },
    removeChoiceButton: {
        marginLeft: 10,
        padding: 5,
    },
    removeChoiceIcon: {
        width: 20,
        height: 20,
    },
    addOptionContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        
    },
    addAnotherOption: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        marginVertical: 10,
    },
    expires: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        marginVertical: 10,
        top: 30, 
    },
    createPollButton: {
        width: Math.min(windowWidth * 0.6, 209.25),
        height: 45,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    createPollText: {
        fontSize: 20,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    icon: {
        width: 16,
        height: 16,
        marginRight: 5,
    },
});