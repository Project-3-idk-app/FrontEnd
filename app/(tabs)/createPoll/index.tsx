import { StyleSheet, View, Text, TouchableOpacity, TextInput, Dimensions, Platform, Image, StatusBar, Modal, Button, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserInfoDb } from '@/components/DataBaseFuncs';
import user from '../user';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get screen dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FeedScreen() {
    const[user, setUser] = useState(); 
    const[userId, setUserId] = useState();
    const [question, setQuestion] = useState(''); 
    const [choices, setChoices] = useState(['','']);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');


    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserFromStorage();
            if (user) {
                setUser(user);
                console.log("User ID:", user.id);
            }
        };

        fetchUser();
        console.log(JSON.stringify(user, null, 2));
    }, []);

    const getUserFromStorage = async () => {
        try {
            const user = await AsyncStorage.getItem("@user");
            if (user) {
                console.log("User locally saved:", JSON.parse(user));
                return JSON.parse(user);
            } else {
                console.log("No user found in AsyncStorage.");
                return null;
            }
        } catch (error) {
            console.error("Error getting user from AsyncStorage", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserFromStorage();
            if (user) {
                setUser(user);
                console.log("User ID:", user.id);
            }
        };

        fetchUser();
        console.log(JSON.stringify(user, null, 2));
    }, []);

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
            return data.poll_id;
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

    const showModal = (message, type) => {
        setModalMessage(message);
        setModalType(type);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        if (modalType === 'success') {
            clearPoll();
        }
    };

    const submitPoll = async () => {
        if(choices.some(choice => choice === '') || question === ''){
            showModal("Cannot have an empty question or choice.", 'error');
            return; 
        }
        setLoading(true);
        let createdPollId = null;
        
        try {
            // Create the poll first
            createdPollId = await createPoll();
            console.log('Created poll with ID:', createdPollId);
            
            try {
                const optionPromises = choices.map(choice => createOption(createdPollId, choice));
                await Promise.all(optionPromises);
                showModal("Poll Created Successfully!", 'success');
            } catch (optionError) {
                console.error('Error creating options:', optionError);
                
                try {
                    const deleteResponse = await fetch(
                        `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/delete/poll/${createdPollId}/`,
                        {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    
                    if (!deleteResponse.ok) {
                        throw new Error('Failed to delete poll after option creation error');
                    }
                } catch (deleteError) {
                    console.error('Error deleting poll:', deleteError);
                }
                showModal("Error creating poll options", 'error');
            }
        } catch (error) {
            showModal("Error creating poll: " + error.message, 'error');
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
                <ScrollView>
                    <View style={{flex: 1, alignItems:'center', justifyContent: 'center'}}>
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
                    </View>
                </ScrollView>

            </ThemedView>
            <Modal
                animationType="fade"
                transparent={true} 
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={[
                        styles.modalContent,
                        modalType === 'error' ? styles.errorModal : styles.successModal
                    ]}>
                        <Text style={[
                            styles.modalText,
                            modalType === 'error' ? styles.errorText : styles.successText
                        ]}>
                            {modalMessage}
                        </Text>
                        <TouchableOpacity 
                            style={[
                                styles.modalButton,
                                modalType === 'error' ? styles.errorButton : styles.successButton
                            ]} 
                            onPress={closeModal}
                        >
                            <Text style={styles.modalButtonText}>
                                {modalType === 'error' ? 'Try Again' : 'Done'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        paddingTop: 5,
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
        fontFamily: 'LexendDeca',
        fontStyle: 'normal',
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
        fontFamily: 'LexendDeca',
        fontStyle: 'normal',
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
        fontFamily: 'LexendDeca',
        fontStyle: 'normal',
    },
    expires: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        marginVertical: 10,
        top: 30, 
        fontFamily: 'LexendDeca',
        fontStyle: 'normal',
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
        fontFamily: 'LexendDeca',
        fontStyle: 'normal',

    },
    icon: {
        width: 16,
        height: 16,
        marginRight: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 5,
    },
    successModal: {
        backgroundColor: '#FFFFFF',
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    errorModal: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FF5252',
        borderWidth: 1,
    },
    modalIcon: {
        width: 50,
        height: 50,
        marginBottom: 15,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    successText: {
        color: '#4CAF50',
    },
    errorText: {
        color: '#FF5252',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        minWidth: 120,
        alignItems: 'center',
    },
    successButton: {
        backgroundColor: '#4CAF50',
    },
    errorButton: {
        backgroundColor: '#FF5252',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
});