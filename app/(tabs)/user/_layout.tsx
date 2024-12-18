import React from "react";
import { Stack, useRouter } from "expo-router";

export default function StackLayout() {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}