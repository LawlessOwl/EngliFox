import { onAuthStateChanged } from "firebase/auth";
import { ConfirmModal } from "../../utils/confirm-modal/confirm-modal.js";
import { elementCreator } from "../../utils/element-creator/elementCreator.js";
import { auth } from "../../utils/firebase/firebase.js";
import { isTaskCompleted } from "../../utils/taskStateUpdate/taskStateUpdate.js";
import { isThemeCompleted } from "../../utils/taskStateUpdate/themeStateUpdate.js";
import styles from "./styles/initTask.module.css";
import { TasksSession } from "./TasksSession/TasksSession.js";

const tasksLibraryResponce = await fetch("/taskLibrary/taskLibrary.json")
const jsonTasksLibrary = await tasksLibraryResponce.json()
const tasksLibrary = jsonTasksLibrary.taskLibrary

export const renderTasks = () => {
    const contentContainer = elementCreator("div", styles["content-container"])
    const taskWrapper = elementCreator("div", styles["task-wrapper"])
    const themeContainer = elementCreator("div", styles["theme-container"])

    const handleThemeClick = async (themeName, themeElement) => {
        document.querySelectorAll(`.${styles["subtask-container"]}`).forEach(container => {
            container.remove()
        })

        const theme = tasksLibrary[themeName]
        const subtasks = Object.keys(theme)

        const subtaskContainer = elementCreator("div", styles["subtask-container"])

        for (const subtaskName of subtasks) {
            const subtaskElement = await createSubtask(themeName, subtaskName)
            subtaskElement.addEventListener("click", () => handleSubtaskClick(themeName, subtaskName))
            subtaskContainer.append(subtaskElement)
        }

        themeElement.insertAdjacentElement('afterend', subtaskContainer)
    }

    const handleSubtaskClick = async (themeName, subtaskName) => {
        const stratTask = () => {
            taskWrapper.innerHTML = ""
            themeContainer.innerHTML = ""

            document.querySelectorAll(`.${styles["subtask-container"]}`).forEach(container => {
                container.remove()
            })

            const tasks = tasksLibrary[themeName][subtaskName].tasks
            new TasksSession(tasks, taskWrapper, themeName, subtaskName)
        }

        const showConfirmModal = async (text) => {
            const confirmModal = new ConfirmModal({
                message: text,
                confirmButtonText: "Начать",
                cancelButtonText: "Отмена"
            })
            return confirmModal.showModal()
        }

        const currentUser = auth.currentUser
        if (!currentUser) return

        const isCompleted = await isTaskCompleted(currentUser.uid, themeName, subtaskName)
        const confirmModalMessage = isCompleted
            ? `Вы хотите пройти задание "${subtaskName}" заново?`
            : `Вы уверены, что хотите начать задание "${subtaskName}"?`

        showConfirmModal(confirmModalMessage).then((confirm) => {
            if(confirm) {
                stratTask()
            }
        })
    }

    const createTheme = async (themeName) => {
        const theme = elementCreator("button", styles["theme"])
        const themeNameElement = elementCreator("div", styles["theme-name"], themeName)

        const currentUser = auth.currentUser

        if (currentUser) {
            const isCompleted = await isThemeCompleted(currentUser.uid, themeName)

            if (isCompleted) {
                theme.classList.add(styles["theme-completed"])
            }
        }

        theme.addEventListener("click", () => handleThemeClick(themeName, theme))
        theme.append(themeNameElement)
        return theme
    }

    const createSubtask = async (themeName, subtaskName) => {
        const subtask = elementCreator("button", styles["subtask"])

        const currentUser = auth.currentUser
        if (currentUser) {
            const isCompleted = await isTaskCompleted(currentUser.uid, themeName, subtaskName)
            if (isCompleted) {
                subtask.classList.add(styles["subtask-completed"])
            }
        }

        const subtaskNameElement = elementCreator("div", styles["subtask-name"], subtaskName)
        subtask.append(subtaskNameElement)
        return subtask
    }

    const initializeThemes = async () => {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (user) => {
                themeContainer.innerHTML = ""

                for (const themeName of Object.keys(tasksLibrary)) {
                    const themeElement = await createTheme(themeName)
                    themeContainer.append(themeElement)
                }
                resolve()
            })
        })
    }

    initializeThemes()

    const tasksWrapper = elementCreator("div", styles["task-wrapper"])
    tasksWrapper.append(themeContainer, taskWrapper)
    contentContainer.append(tasksWrapper)
    return contentContainer
}
