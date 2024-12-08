import { Alert, Platform } from "react-native";

export const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
        alert(`${title}: ${message}`);
    } else {
        Alert.alert(title, message);
    }
};


export type User = {
    id: string;
    username: string;
    email: string;
    picture: string;
    //The rest we dont really care about for our db, but are given by google
    given_name?: string;
    verified_email?: boolean;
    name?: string;
    family_name?: string;
    hd?: string;
};


// Type definition for a single poll option
export type Option = {
    optionTitle: string;
    optionVoteNum: number;
    friendVoteNum: number;
};

// Type definition for the poll
export type Poll = {
    pollId: number;
    title: string;
    totalVotes: number;
    totalFriendVotes: number;
    options: Option[];
};

//Type definition for friend 
export type Friend = {
    friendId: number;
    friendUsername: string; 
    friendStatus: string; 
}


// Fake Infromation For Users and Polls
export const fakeuser: User = {
    id: "1",
    username: "hbox",
    email: "example@gmail.com",
    picture: "https://yt3.googleusercontent.com/ytc/AIdro_nAQSpke2TuTIcm6donidgAH2BHGc-HyOzPptIjiU82tg=s160-c-k-c0x00ffffff-no-rj"
};

export const fakeConcluded: Poll[] = [
    {
        pollId: 1,
        title: "Which season do you enjoy most?",
        totalVotes: 100,
        totalFriendVotes: 20,  // 10 + 5 + 3 + 2
        options: [
            { friendVoteNum: 10, optionVoteNum: 35, optionTitle: "Summer" },
            { friendVoteNum: 5, optionVoteNum: 25, optionTitle: "Winter" },
            { friendVoteNum: 3, optionVoteNum: 20, optionTitle: "Spring" },
            { friendVoteNum: 2, optionVoteNum: 20, optionTitle: "Fall" },
        ],
    },
    {
        pollId: 2,
        title: "Which movie genre do you prefer?",
        totalVotes: 100,
        totalFriendVotes: 30,  // 15 + 8 + 5 + 2
        options: [
            { friendVoteNum: 15, optionVoteNum: 40, optionTitle: "Action" },
            { friendVoteNum: 8, optionVoteNum: 30, optionTitle: "Comedy" },
            { friendVoteNum: 5, optionVoteNum: 20, optionTitle: "Drama" },
            { friendVoteNum: 2, optionVoteNum: 10, optionTitle: "Horror" },
        ],
    },
    {
        pollId: 3,
        title: "What is your favorite sport to watch?",
        totalVotes: 100,
        totalFriendVotes: 35,  // 20 + 10 + 5 + 0
        options: [
            { friendVoteNum: 20, optionVoteNum: 50, optionTitle: "Football" },
            { friendVoteNum: 10, optionVoteNum: 25, optionTitle: "Basketball" },
            { friendVoteNum: 5, optionVoteNum: 15, optionTitle: "Soccer" },
            { friendVoteNum: 0, optionVoteNum: 10, optionTitle: "Tennis" },
        ],
    },
    {
        pollId: 4,
        title: "What is your favorite way to spend free time?",
        totalVotes: 100,
        totalFriendVotes: 40,  // 15 + 20 + 5 + 0
        options: [
            { friendVoteNum: 15, optionVoteNum: 40, optionTitle: "Reading" },
            { friendVoteNum: 20, optionVoteNum: 30, optionTitle: "Gaming" },
            { friendVoteNum: 5, optionVoteNum: 20, optionTitle: "Cooking" },
            { friendVoteNum: 0, optionVoteNum: 10, optionTitle: "Exercise" },
        ],
    },
    {
        pollId: 5,
        title: "What is your favorite type of cuisine?",
        totalVotes: 100,
        totalFriendVotes: 38,  // 10 + 15 + 5 + 8
        options: [
            { friendVoteNum: 10, optionVoteNum: 40, optionTitle: "Italian" },
            { friendVoteNum: 15, optionVoteNum: 25, optionTitle: "Mexican" },
            { friendVoteNum: 5, optionVoteNum: 20, optionTitle: "Japanese" },
            { friendVoteNum: 8, optionVoteNum: 15, optionTitle: "Indian" },
        ],
    },
    {
        pollId: 6,
        title: "Which genre of music do you prefer?",
        totalVotes: 100,
        totalFriendVotes: 50,  // 12 + 20 + 10 + 8
        options: [
            { friendVoteNum: 12, optionVoteNum: 35, optionTitle: "Rock" },
            { friendVoteNum: 20, optionVoteNum: 30, optionTitle: "Pop" },
            { friendVoteNum: 10, optionVoteNum: 25, optionTitle: "Classical" },
            { friendVoteNum: 8, optionVoteNum: 10, optionTitle: "Jazz" },
        ],
    },
];

export const fakeCurrent = [
    {
        pollId: 7,
        title: "What is your go-to morning drink?",
        totalVotes: 100,
        totalFriendVotes: 40,  // 25 + 10 + 5 + 0
        options: [
            { friendVoteNum: 25, optionVoteNum: 50, optionTitle: "Coffee" },
            { friendVoteNum: 10, optionVoteNum: 30, optionTitle: "Tea" },
            { friendVoteNum: 5, optionVoteNum: 15, optionTitle: "Juice" },
            { friendVoteNum: 0, optionVoteNum: 5, optionTitle: "Water" },
        ],
    },
    {
        pollId: 8,
        title: "Which social media platform do you use most often?",
        totalVotes: 100,
        totalFriendVotes: 55,  // 30 + 20 + 5 + 0
        options: [
            { friendVoteNum: 30, optionVoteNum: 40, optionTitle: "Instagram" },
            { friendVoteNum: 20, optionVoteNum: 35, optionTitle: "TikTok" },
            { friendVoteNum: 5, optionVoteNum: 15, optionTitle: "Twitter" },
            { friendVoteNum: 0, optionVoteNum: 10, optionTitle: "Facebook" },
        ],
    },
    {
        pollId: 9,
        title: "What type of vacation do you prefer?",
        totalVotes: 100,
        totalFriendVotes: 35,  // 18 + 10 + 5 + 2
        options: [
            { friendVoteNum: 18, optionVoteNum: 40, optionTitle: "Beach" },
            { friendVoteNum: 10, optionVoteNum: 30, optionTitle: "City" },
            { friendVoteNum: 5, optionVoteNum: 20, optionTitle: "Mountains" },
            { friendVoteNum: 2, optionVoteNum: 10, optionTitle: "Cruise" },
        ],
    },
    {
        pollId: 10,
        title: "What is your favorite type of pet?",
        totalVotes: 100,
        totalFriendVotes: 72,  // 40 + 30 + 2 + 0
        options: [
            { friendVoteNum: 40, optionVoteNum: 50, optionTitle: "Dog" },
            { friendVoteNum: 30, optionVoteNum: 35, optionTitle: "Cat" },
            { friendVoteNum: 2, optionVoteNum: 10, optionTitle: "Fish" },
            { friendVoteNum: 0, optionVoteNum: 5, optionTitle: "Bird" },
        ],
    },
];

export enum friendStatus {
    SENT = 0,
    PENDING = 1,
    FRIENDS = 2,
    // Likely not going to get used
    BLOCKED = 3,

}

// Fake friend data
export const fakeFriendRequests = [
    {
        id: 1,
        userId: 101,
        username: 'JustNekoChris',
        status: friendStatus.PENDING,
        created_at: '2024-03-25T10:30:00Z',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JustNekoChris'
    },
    {
        id: 2,
        userId: 102,
        username: 'DaSpeedSta',
        status: friendStatus.PENDING,
        created_at: '2024-03-24T15:45:00Z',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DaSpeedSta'
    },
    {
        id: 3,
        userId: 103,
        username: 'HappyFunBuns',
        status: friendStatus.PENDING,
        created_at: '2024-03-24T09:20:00Z',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HappyFunBuns'
    },
    {
        id: 4,
        userId: 104,
        username: 'Chgunz',
        status: friendStatus.PENDING,
        created_at: '2024-03-23T18:15:00Z',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GamingPro'
    },
    {
        id: 5,
        userId: 105,
        username: 'FrogWizard',
        status: friendStatus.PENDING,
        created_at: '2024-03-23T14:10:00Z',
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frog'
    }
];