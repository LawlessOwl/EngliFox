import { appRouter } from "../../../App"
import { elementCreator } from "../../element-creator/elementCreator"
import { renderTranslateTask } from "./TasksTypes/translateTask/translateTask"
import {initializeTask} from "./components/taskInitializer/taskinitializer.js"

export const tasksLibrary = {
    food: {
        familyDinner: {
            firstTask: {
                id: "1",
                type: "en-ru-translate",
                content: "What do we eat for dinner?",
                answer: "Что мы едим на ужин?",
                answerOptions: ["Мы", "Едим", "Что", "На", "Ужин"],
            }
        }
    }
}

export const renderTasks = () => {
    const themeContainer = elementCreator("div", "theme-container")
    const subtaskContainer = elementCreator("div", "subtask-container")
    const tasksContainer = elementCreator("div", "tasks-container")

    const createTheme = (themeName) => {
        const theme = elementCreator("div", "theme")
        const themeNameElement = elementCreator("div", "theme-name", themeName)
        theme.append(themeNameElement)
        themeContainer.append(theme)
        return theme
    }

    const createSubtask = (subtaskName) => {
        const subtask = elementCreator("div", "subtask")
        const subtaskNameElement = elementCreator("div", "subtask-name", subtaskName)
        subtask.append(subtaskNameElement)
        subtaskContainer.append(subtask)
        return subtask
    }

    const createTask = (taskInfo) => {
        const task = initializeTask(taskInfo)
        return task
    }

    themeContainer.append(createTheme("Food", tasksLibrary.food))
    subtaskContainer.append(createSubtask("Family dinner"))
    tasksContainer.append(createTask(tasksLibrary.food.familyDinner.firstTask))

    const tasksWrapper = elementCreator("div", "tasks-wrapper")
    tasksWrapper.append(themeContainer, subtaskContainer, tasksContainer)
    return tasksWrapper
}