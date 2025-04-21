const COMPLETED_TASKS = "completedTasks"

export const getCompletedTasks = () => {
    return JSON.parse(localStorage.getItem(COMPLETED_TASKS)) || {}
}

export const markTaskAsCompleted = (themeName, subtaskName) => {
    let completedTasks = getCompletedTasks()
    if (Array.isArray(completedTasks)) completedTasks = {}
    if (!completedTasks[themeName]) completedTasks[themeName] = []
    if (!completedTasks[themeName].includes(subtaskName)) {
        completedTasks[themeName].push(subtaskName)
        localStorage.setItem(COMPLETED_TASKS, JSON.stringify(completedTasks))
        console.log("ufterupdate:", completedTasks)
    }
}

export const isTaskCompleted = (themeName, subtaskName) => {
    const completedTasks = getCompletedTasks()
    console.log("completedTasks", completedTasks)
    return completedTasks[themeName]?.includes(subtaskName)
}