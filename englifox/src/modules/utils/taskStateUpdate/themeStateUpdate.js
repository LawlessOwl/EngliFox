import { firebaseService } from "../firebase/FirebaseService/FirebaseService";
import { getCompletedTasks } from "../taskStateUpdate/taskStateUpdate.js";

let taskLibrary = null

const loadTaskLibrary = async () => {
    if (!taskLibrary) {
        const response = await fetch("/taskLibrary/taskLibrary.json")
        const taskLibraryData = await response.json()
        taskLibrary = taskLibraryData.taskLibrary
    }
    return taskLibrary
}

export const getCompletedThemes = async(userId) => {
    const user = await firebaseService.readUserData(userId)
    return user?.completedThemes || []
}

export const getAllSubtasksForTheme = async (themeName) => {
    const library = await loadTaskLibrary();
    const theme = library[themeName]
    return theme ? Object.keys(theme) : []
}

export const markThemeAsCompleted = async(userId, themeName) => {
    const allSubtasks = await getAllSubtasksForTheme(themeName)
    const completedTasks = await getCompletedTasks(userId)
    const completedSubtasks = completedTasks[themeName] || []

    const isAllTasksCompleted = allSubtasks.length > 0 && allSubtasks.every(subtask => completedSubtasks.includes(subtask))

    if(isAllTasksCompleted) {
        const completedThemes = await getCompletedThemes(userId)
        if(!completedThemes.includes(themeName)) {
            completedThemes.push(themeName)
            await firebaseService.updateUserData(userId, {completedThemes})
            return true
        }
    }
    return false
}



export const isThemeCompleted = async(userId, themeName) => {
    const completedThemes = await getCompletedThemes(userId)
    return completedThemes.includes(themeName)
}
