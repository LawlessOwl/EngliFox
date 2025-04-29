import { firebaseService } from '../firebase/FirebaseService/FirebaseService.js';

export const calculateUserPoints = ({ tasks = 0, subtask = false, theme = false}) => {
    let points = 0;
    points += tasks;
    if(subtask) points += 5;
    if(theme) points += 10;
    return points;
}

export const addPointsToUser = async (userId, pointsToAdd) => {
    try {
        const user = await firebaseService.readUserData(userId);
        if(!user) return;

        const updateUser = {
            ...user,
            points: user.points + pointsToAdd
        }

        await firebaseService.updateUserData(userId, updateUser);
    }
    catch(error) {
        console.log(error);
    }
}