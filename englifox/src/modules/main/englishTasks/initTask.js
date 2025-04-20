import { appRouter } from "../../../App"
import { elementCreator } from "../../utils/element-creator/elementCreator.js"
import { TasksSession } from "./TasksSession/TasksSession.js"
import { confirmModal } from "../../utils/confirm-modal/confirm-modal.js"


export const tasksLibrary = {
    food: {
        familyDinner: {
            tasks: [
                {
                    id: "1",
                    type: "translate",
                    content: "What do we eat for dinner?",
                    answer: "Что мы едим на ужин?",
                    answerOptions: ["Мы", "Едим", "Что", "На", "Ужин"],
                },
                {
                    id: "2",
                    type: "audition",
                    content: "What are we having today for dinner?",
                    answer: "Что мы сегодня едим на ужин?",
                    answerOptions: ["Что", "Мы", "Сегодня", "Едим", "На", "Ужин", "Завтрак", "Обед", "Ешь"],
                },
                {
                    id: "3",
                    type: "pairs",
                    content: "Найдите пры слов",
                    lang: "en",
                    pairs: [
                        {ru: "Яблоко", en: "Apple"},
                        {ru: "Молоко", en: "Milk"},
                        {ru: "Кофе", en: "Coffee"},
                        {ru: "Чай", en: "Tea"},
                        {ru: "Хлеб", en: "Bread"},
                        {ru: "Сыр", en: "Cheese"},
                        {ru: "Мясо", en: "Meat"}
                    ]
                }
            ] 
        }
    }
}

export const renderTasks = () => {
    const taskWrapper = elementCreator("div", "task-wrapper")
    const themeContainer = elementCreator("div", "theme-container")
    const subtaskContainer = elementCreator("div", "subtask-container")
    const tasksContainer = elementCreator("div", "tasks-container")

    const handleThemeClick = (themeName) => {
        const theme = tasksLibrary[themeName]
        const subtasks = Object.keys(theme)
        subtasks.forEach((subtaskName) => {
            const subtaskElement = createSubtask(subtaskName)
            subtaskElement.addEventListener("click", () => handleSubtaskClick(themeName, subtaskName))
            subtaskContainer.append(subtaskElement)
        })
    }

    const handleSubtaskClick = (themeName, subtaskName) => {
        confirmModal(`Вы уверены, что хотите начать задание "${subtaskName}"?`)
        .then(userConfirmed => {
            if(userConfirmed) {
                taskWrapper.innerHTML = ""
                themeContainer.innerHTML = ""
                subtaskContainer.innerHTML = ""
                const tasks = tasksLibrary[themeName][subtaskName].tasks
                new TasksSession(tasks, taskWrapper)
            }
        })
    }

    const createTheme = (themeName) => {
        const theme = elementCreator("div", "theme")
        const themeNameElement = elementCreator("div", "theme-name", themeName)
        themeNameElement.addEventListener("click", () => handleThemeClick(themeName))
        theme.append(themeNameElement)
        return theme
    }

    const createSubtask = (subtaskName) => {
        const subtask = elementCreator("div", "subtask")
        const subtaskNameElement = elementCreator("div", "subtask-name", subtaskName)
        subtask.append(subtaskNameElement)
        subtaskContainer.append(subtask)
        return subtask
    }

    Object.keys(tasksLibrary).forEach((themeName) => {
        const themeElement = createTheme(themeName)
        themeContainer.append(themeElement)
    })

    const tasksWrapper = elementCreator("div", "task-wrapper")
    tasksWrapper.append(themeContainer, subtaskContainer, taskWrapper)
    return tasksWrapper
}