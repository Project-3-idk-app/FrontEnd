import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#CB046B', 
                tabBarInactiveTintColor: '#F1E9DA',
                tabBarStyle: {backgroundColor:'black'},
                headerShown: false,
            }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: '',
                    tabBarIcon: ({ focused, color, size }) => {
                        return(<Image
                                style={{ width: size, height: size }} // Dynamically adjust size
                                source={require('@/assets/images/HomeIcon.png')} // Correct way to use local images
                            />
                        );
                    },
                }}
            />
             <Tabs.Screen
                name="friends"
                options={{
                    title: '',
                    tabBarIcon: ({ focused, color, size }) => {
                        return(<Image
                                style={{ width: 30, height: 30 }} // Dynamically adjust size
                                source={require('@/assets/images/gmail_groups.png')} // Correct way to use local images
                            />
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="createPoll"
                options={{
                    title: '',
                    tabBarIcon: ({ focused, color, size }) => {
                        return(<Image
                                style={{ width: size, height: size }} // Dynamically adjust size
                                source={require('@/assets/images/add_circle.png')} // Correct way to use local images
                            />
                        );
                    },
                }}
            />
             <Tabs.Screen
                name="notifs"
                options={{
                    title: '',
                    tabBarIcon: ({ focused, color, size }) => {
                        return(<Image
                                style={{ width: size, height: size }} // Dynamically adjust size
                                source={require('@/assets/images/notifications.png')} // Correct way to use local images
                            />
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="user"
                options={{
                    title: '',
                    tabBarIcon: ({ focused, color, size }) => {
                        return(<Image
                                style={{ width: size, height: size }} // Dynamically adjust size
                                source={require('@/assets/images/account_circle.png')} // Correct way to use local images
                            />
                        );
                    },
                }}
            />
        </Tabs>
    );
}
