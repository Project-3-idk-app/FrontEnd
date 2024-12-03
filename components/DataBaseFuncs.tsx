import { User } from "./Types";

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