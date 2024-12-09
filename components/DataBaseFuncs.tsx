import { Alert, Platform } from "react-native";
import { showAlert, User } from "./Types";

// Returns user information or null
export const getUserInfoDb = async (userId : number) => {
    if(typeof(userId) == "undefined"){
        console.log('user id was undefined');
        return null;
    }
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/user/${userId}/`;
    console.log("url is ", url)
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if(data.error){
            console.log('user not found');
            return null;
        }
        console.log("data within the db func is ", data);
        return data as User;
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
};

export const createUser = async (user: User) => {
    console.log("user to be made in the system", user);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/create/user/`;
    // const url = `http://127.0.0.1:8000/create/user/`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "picture": user.picture
            }),
        });

        const data: User = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};


export const searchUsersBool = async (user: string) => {
    console.log("user to be searched", user);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/searchusers/${user}/`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log(data);
        const hasDuplicate = data.some((i:User) => i.username === user);
        if (hasDuplicate) {
            console.log("Error: duplicate username");
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

export const searchUsersArray = async (user: string) => {
    console.log("user to be searched", user);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/searchusers/${user}/`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log(data);
        return data as User[];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

export const updateUser = async (user: User) => {
    console.log("updateUser: searching on", user);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/update/user/${user.id}/`;
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "picture": user.picture
            }),
        });

        const data = await response.json();
        if (data.error) {
            console.log('updateUser: update not accepted');
            return null;
        }
        else if (typeof(data.email) != 'string') {
            console.log
            console.log('updateUser: email not accepted');
            return null
        }
        console.log("updateUser: returning ", data);
        return data as User;
    } catch (error) {
        console.error('updateUser: Error:', error);
    }
    return null;
};



export const deleteAccount = async (user: string) => {
    console.log("user to be searched", user);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/delete/user/${user}/`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log(data);
        return true;
    } catch (error) {
        console.error('deleteAccount: FetchError:', error);
        return false;
    }
};

// 0 - not recieved, 1 - accepted, 2 - declined
export const sendFriendRequest = async (sender: string, reciever: string) => {
    console.log('sendFriendRequest: x wants y: ', sender, reciever);
    if(sender === reciever){
        showAlert("Error", "Cant send a friend request to yourself!");
        return null;
    }
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/friendrequest/${sender}/${reciever}/`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user_id1" : sender,
                "user_id2" : reciever,
                "status": 0
            }),
        });

        const data: User = await response.json();
        console.log('sendFriendRequest', data);
        if (data.error){
            if (data.error == 'Friendship already exists') {
                showAlert("Error", "You already made a friend request with this person!")
            }
            return null;
        }
        else if ((data.detail == 'Method "GET" not allowed.')) {
            console.log('sendFriendRequest:', data.error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('sendFriendRequest: Error:', error);
        showAlert("Error", "Please try again")
        return null;
    }
};



export const getUserFriends = async (user: string) => {
    console.log("user to check friends", user);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/getfriends/${user}/`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('getUserData:', data);
        if (data.error) {
            console.error('Error:', data.error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};
// Returns Pending as well as sent Requests.
export const getNotifications = async (user: string) => {
    console.log('getNotificationss: user is', user);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/getnotifications/${user}/`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('getNotifs:', data);
        if (data.error) {
            console.error('Error:', data.error);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export const acceptFriendRequest = async (id1: string, id2: string) => {
    console.log("acceptFriendRequest: searching on", id1, id2);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/acceptfriendrequest/${id1}/${id2}/`;
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({
                
            // }),
        });

        const data = await response.json();
        if (data.error) {
            console.log('acceptFriendRequest: update not accepted');
            return null;
        }
        console.log("acceptFriendRequest: returning ", data);
        return data;
    } catch (error) {
        console.error('acceptFriendRequest: Error:', error);
    }
    return null;
};
export const rejectFriendRequest = async (id1: string, id2: string) => {
    console.log("rejectFriendRequest: searching on", id1, id2);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/rejectfriendrequest/${id1}/${id2}/`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({

            // }),
        });

        const data = await response.json();
        if (data.error) {
            console.log('rejectFriendRequest: update not accepted');
            return null;
        }
        console.log("rejectFriendRequest: returning ", data);
        return data;
    } catch (error) {
        console.error('rejectFriendRequest: Error:', error);
    }
    return null;
};
export const deleteFriend = async (id1: string, id2: string) => {
    console.log("deleteFriend: searching on", id1, id2);
    const url = `https://thawing-reef-69338-bd2a9c51eb3e.herokuapp.com/unfriend/${id1}/${id2}/`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({

            // }),
        });

        const data = await response.json();
        if (data.error) {
            console.log('deleteFriend: update not accepted');
            return null;
        }
        console.log("deleteFriend: returning ", data);
        return data;
    } catch (error) {
        console.error('deleteFriend: Error:', error);
    }
    return null;
};