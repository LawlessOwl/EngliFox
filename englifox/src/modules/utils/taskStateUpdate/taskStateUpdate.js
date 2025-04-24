import { firebaseService } from "../firebase/FirebaseService/FirebaseService.js"

export const getCompletedTasks = async(userId) => {
    const user = await firebaseService.readUserData(userId)
    return user?.completedTasks || {}
}

export const markTaskAsCompleted = async(userId, themeName, subtaskName) => {
    if (!subtaskName) return
    
    const completedTasks = await getCompletedTasks(userId)
    if(!completedTasks[themeName]) {
        completedTasks[themeName] = []
    }

    if(!completedTasks[themeName].includes(subtaskName)) {
        completedTasks[themeName].push(subtaskName)

        await firebaseService.updateUserData(userId, {completedTasks})
    }
}

export const isTaskCompleted = async(userId, themeName, subtaskName) => {
    const completedTasks = await getCompletedTasks(userId)
    return completedTasks[themeName]?.includes(subtaskName) || false
}