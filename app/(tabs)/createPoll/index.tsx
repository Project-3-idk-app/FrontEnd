import { StyleSheet, View, Text, TouchableOpacity, TextInput, Dimensions, Platform, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

// Get screen dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FeedScreen() {
    const [question, setQuestion] = useState(''); 
    const [choices, setChoices] = useState(['','']);

    const addChoice = () => {
        if(choices.length < 4){
            setChoices([...choices, '']); 
        }
    }

    const clearPoll = () => {
        if(choices.length > 2)
        {
            const updatedChoices = choices.slice(0, 2);
            setChoices(updatedChoices);
        }
        setQuestion(''); 
        setChoices(['', '']); 
    }

    const updateChoice = (index, value) =>{
        const updatedChoices = [...choices];
        updatedChoices[index] = value;
        setChoices(updatedChoices); 
    }
    const removeChoice = () => {
        // remove the last choice
        const updatedChoices = choices.slice(0, choices.length - 1);
        setChoices(updatedChoices);
    };
    const submitPoll = () => {
        console.log("Question:", question);
        console.log("Choices:", choices);
    }; 

    return (
        <View style={styles.fullPage}>
            <View style={styles.rectangle13}>
                <TouchableOpacity onPress={clearPoll}>
                        <img src='assets/images/close_ring.png' style={styles.crossIcon}></img>
                    </TouchableOpacity>
                <View style={styles.group1}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.askQuestion}
                            placeholder="Ask a question ..."
                            placeholderTextColor="#FFFFFF"
                            value={question}
                            onChangeText={setQuestion}/>
                    </View>
                
                    <View style={styles.choicesContainer}>
                        {choices.map((choice, index) => (
                            <TextInput
                                key={index}
                                style={styles.choice}
                                placeholder={`Choice ${index + 1} ...`}
                                placeholderTextColor="#F1E9DA"
                                value={choice}
                                onChangeText={(text) => updateChoice(index, text)} // Update specific choice
                            />
                        ))}
                    </View>

                    {choices.length < 4 && (
                        <TouchableOpacity style={styles.addOptionContainer} onPress={addChoice}>
                            <img src='assets/images/Chat_plus.png' style={styles.icon} />
                            <Text style={styles.addAnotherOption}>Add Another Option</Text>
                        </TouchableOpacity>
                    )}

                    {choices.length > 2 && (
                        <TouchableOpacity style={styles.removeOptionContainer} onPress={(removeChoice)}>
                            <img src='assets/images/Dell_light.png' style={styles.icon} />
                            <Text style={styles.addAnotherOption}>Remove Option</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1E9DA',
    },
    fullPage: {
        flex: 1,
        backgroundColor: '#F1E9DA',
        justifyContent: 'center',
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
        paddingVertical: 20,
    },
    crossIcon:{
        width: 25,
        height: 25,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    askQuestion: {
        width: '90%',
        minHeight: 50,
        backgroundColor: '#5D47A0',
        borderRadius: 5,
        paddingHorizontal: 15,
        fontSize: 20,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    choicesContainer: {
        width: '90%',
        gap: 10,
        marginBottom: 20,
    },
    choice: {
        width: '100%',
        minHeight: 40,
        backgroundColor: '#BB146A',
        borderRadius: 5,
        paddingHorizontal: 15,
        fontSize: 15,
        color: '#F1E9DA',
        textAlign: 'center',
        marginVertical: 5,
    },
    addOptionContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginVertical: 10,
    },
    removeOptionContainer: {
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
        top:45, 
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
    group7: {
        width: '100%',
        height: 60,
        backgroundColor: '#000000',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    frame3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 35,
        paddingVertical: 8,
    },
    icon: {
        width: 16,
        height: 16,
        marginRight:5,
    },
});