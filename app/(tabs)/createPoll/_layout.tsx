import React from "react";
import { Stack, useRouter } from "expo-router";

export default function StackLayout() {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Create Poll",
                    headerShown: false,
                }}
            />
        </Stack>
    );
}