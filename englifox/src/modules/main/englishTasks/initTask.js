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

    const handleThemeClick = (themeName, themeElement) => {
        // Очищаем все существующие подтемы
        document.querySelectorAll(`.${styles["subtask-container"]}`).forEach(container => {
            container.remove()
        })

        const theme = tasksLibrary[themeName]
        const subtasks = Object.keys(theme)

        // Создаем контейнер для подтем
        const subtaskContainer = elementCreator("div", styles["subtask-container"])

        subtasks.forEach((subtaskName) => {
            const subtaskElement = createSubtask(themeName, subtaskName)
            subtaskElement.addEventListener("click", () => handleSubtaskClick(themeName, subtaskName))
            subtaskContainer.append(subtaskElement)
        })

        // Вставляем контейнер с подтемами сразу после выбранной темы
        themeElement.insertAdjacentElement('afterend', subtaskContainer)
    }

    const handleSubtaskClick = (themeName, subtaskName) => {
        const stratTask = () => {
            taskWrapper.innerHTML = ""
            themeContainer.innerHTML = ""
            
            // Очищаем все контейнеры подтем
            document.querySelectorAll(`.${styles["subtask-container"]}`).forEach(container => {
                container.remove()
            })

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
        const theme = elementCreator("button", styles["theme"])
        const themeNameElement = elementCreator("div", styles["theme-name"], themeName)
        theme.addEventListener("click", () => handleThemeClick(themeName, theme))
        theme.append(themeNameElement)
        return theme
    }

    const createSubtask = (themeName, subtaskName) => {
        const subtask = elementCreator("button", styles["subtask"])
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
    tasksWrapper.append(themeContainer, taskWrapper)
    contentContainer.append(tasksWrapper)
    return contentContainer
}
