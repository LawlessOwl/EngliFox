import { elementCreator } from "../../utils/element-creator/elementCreator.js"
import { TasksSession } from "./TasksSession/TasksSession.js"
import { confirmModal } from "../../utils/confirm-modal/confirm-modal.js"
import { markTaskAsCompleted, isTaskCompleted } from "../../utils/taskStateUpdate/taskStateUpdate.js"

const tasksLibraryResponce = await fetch("/taskLibrary/taskLibrary.json")
const jsonTasksLibrary = await tasksLibraryResponce.json()
const tasksLibrary = jsonTasksLibrary.taskLibrary



export const renderTasks = () => {
    const taskWrapper = elementCreator("div", "task-wrapper")
    const themeContainer = elementCreator("div", "theme-container")
    const subtaskContainer = elementCreator("div", "subtask-container")

    const handleThemeClick = (themeName) => {
        const theme = tasksLibrary[themeName]
        const subtasks = Object.keys(theme)
        subtasks.forEach((subtaskName) => {
            const subtaskElement = createSubtask(themeName, subtaskName)
            subtaskElement.addEventListener("click", () => handleSubtaskClick(themeName, subtaskName))
            subtaskContainer.append(subtaskElement)
        })
    }

    const handleSubtaskClick = (themeName, subtaskName) => {
        const stratTask = () => {
            taskWrapper.innerHTML = ""
            themeContainer.innerHTML = ""
            subtaskContainer.innerHTML = ""
            const tasks = tasksLibrary[themeName][subtaskName].tasks
            new TasksSession(tasks, taskWrapper, themeName, subtaskName)
        }

        if(isTaskCompleted(themeName, subtaskName)) {
            confirmModal(`Хотите снова пройти "${subtaskName}"?`)
            .then(userConfirmed => {
                if(userConfirmed) {
                    stratTask()
                }
            })
            return
        } else {
            confirmModal(`Вы уверены, что хотите начать задание "${subtaskName}"?`)
            .then(userConfirmed => {
                if(userConfirmed) {
                    stratTask()
                }
            })
            return
        }
    }

    const createTheme = (themeName) => {
        const theme = elementCreator("div", "theme")
        const themeNameElement = elementCreator("div", "theme-name", themeName)
        themeNameElement.addEventListener("click", () => handleThemeClick(themeName))
        theme.append(themeNameElement)
        return theme
    }

    const createSubtask = (themeName, subtaskName) => {
        const subtask = elementCreator("div", "subtask")
        if(isTaskCompleted(themeName, subtaskName)) {
            subtask.classList.add("completed")
        }
        const subtaskNameElement = elementCreator("div", "subtask-name", subtaskName)
        subtask.append(subtaskNameElement)
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