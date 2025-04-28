import { ConfirmModal } from "../../utils/confirm-modal/confirm-modal.js"
import { elementCreator } from "../../utils/element-creator/elementCreator.js"
import { isTaskCompleted } from "../../utils/taskStateUpdate/taskStateUpdate.js"
import { TasksSession } from "./TasksSession/TasksSession.js"
import styles from "./styles/initTask.module.css"

const tasksLibraryResponce = await fetch("/taskLibrary/taskLibrary.json")
const jsonTasksLibrary = await tasksLibraryResponce.json()
const tasksLibrary = jsonTasksLibrary.taskLibrary

export const renderTasks = () => {
    const contentContainer = elementCreator("div", styles["content-container"])
    const taskWrapper = elementCreator("div", styles["task-wrapper"])
    const themeContainer = elementCreator("div", styles["theme-container"])
    const subtaskContainer = elementCreator("div", styles["subtask-container"])

    const handleThemeClick = (themeName) => {
        subtaskContainer.innerHTML = ""
        const theme = tasksLibrary[themeName]
        const subtasks = Object.keys(theme)

        if (subtasks.length > 0) {
            themeContainer.querySelectorAll(`.${styles["theme-name"]}`).forEach((themeElement) => {
                themeElement.classList.remove(styles["link-line-visible"])
            })
            subtaskContainer.classList.add(styles["link-line-visible"])
        }

        subtasks.forEach((subtaskName) => {
            const subtaskElement = createSubtask(themeName, subtaskName)
            subtaskElement.addEventListener("click", () => handleSubtaskClick(themeName, subtaskName))
            subtaskContainer.append(subtaskElement)
        })

        const clickedThemeElement = [...themeContainer.children].find((element) => element.querySelector(`.${styles["theme-name"]}`).textContent === themeName)
        clickedThemeElement.classList.add(styles["link-line-visible"])
    }

    const handleSubtaskClick = (themeName, subtaskName) => {
        const stratTask = () => {
            taskWrapper.innerHTML = ""
            themeContainer.innerHTML = ""
            subtaskContainer.innerHTML = ""

            themeContainer.querySelectorAll(`.${styles["theme"]}`).forEach((themeElement) => {
                themeElement.classList.remove(styles["link-line-visible"])
            })
            subtaskContainer.classList.remove(styles["link-line-visible"])

            const tasks = tasksLibrary[themeName][subtaskName].tasks
            new TasksSession(tasks, taskWrapper, themeName, subtaskName)
        }

        const showConfirmModal = async (text) => {
            const confirmModal = new ConfirmModal({ message: text, confirmButtonText: "Начать", cancelButtonText: "Отмена" })
            return confirmModal.showModal()
        }

        const confrirmModalMessage = isTaskCompleted(themeName, subtaskName) ? `Вы хотите пройти задание "${subtaskName}" заново?` : `Вы уверены, что хотите начать задание "${subtaskName}"?`

        showConfirmModal(confrirmModalMessage).then((confirm) => {
            if(confirm) {
                stratTask()
            }
        })
    }

    const createTheme = (themeName) => {
        const theme = elementCreator("div", styles["theme"])
        const themeNameElement = elementCreator("div", styles["theme-name"], themeName)
        themeNameElement.addEventListener("click", () => handleThemeClick(themeName))
        theme.append(themeNameElement)
        return theme
    }

    const createSubtask = (themeName, subtaskName) => {
        const subtask = elementCreator("div", styles["subtask"])
        if(isTaskCompleted(themeName, subtaskName)) {
            subtask.classList.add("completed")
        }
        const subtaskNameElement = elementCreator("div", styles["subtask-name"], subtaskName)
        subtask.append(subtaskNameElement)
        return subtask
    }

    Object.keys(tasksLibrary).forEach((themeName) => {
        const themeElement = createTheme(themeName)
        themeContainer.append(themeElement)
    })

    const tasksWrapper = elementCreator("div", styles["task-wrapper"])
    tasksWrapper.append(themeContainer, subtaskContainer, taskWrapper)
    contentContainer.append(tasksWrapper)
    return contentContainer
}
