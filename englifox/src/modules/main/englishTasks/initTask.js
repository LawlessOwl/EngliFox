import { appRouter } from "../../../App"
import { elementCreator } from "../../utils/element-creator/elementCreator.js"
import { TasksSession } from "./TasksSession/TasksSession.js"


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

    themeContainer.append(createTheme("Food", tasksLibrary.food))
    subtaskContainer.append(createSubtask("Family dinner"))
    
    const tasksArray = tasksLibrary.food.familyDinner.tasks
    new TasksSession(tasksArray, tasksContainer)

    const tasksWrapper = elementCreator("div", "tasks-wrapper")
    tasksWrapper.append(themeContainer, subtaskContainer, tasksContainer)
    return tasksWrapper
}