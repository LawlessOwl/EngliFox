import { appRouter } from "../../../../App.js"
import { elementCreator } from "../../../utils/element-creator/elementCreator.js"
import { firebaseService } from "../../../utils/firebase/FirebaseService/FirebaseService.js"
import { getCompletedTasks, markTaskAsCompleted } from "../../../utils/taskStateUpdate/taskStateUpdate.js"
import { TaskFactory } from "../components/TaskFactory/TaskFactory.js"
import { calculateUserPoints ,addPointsToUser } from "../../../utils/userPointsManager/userPointsManager.js"
import { isThemeCompleted, markThemeAsCompleted, getAllSubtasksForTheme, getCompletedThemes } from "../../../utils/taskStateUpdate/themeStateUpdate.js"

export class TasksSession {
    constructor(tasksArray, container, themeName, subtaskName) {
        this.tasks = tasksArray
        this.container = container
        this.themeName = themeName
        this.subtaskName = subtaskName
        this.currentTaskId = 0
        this.userId = null
        this.userPoints = 0
        this.renderCurrentTask()
        this.fetchUserId()
    }

    async fetchUserId() {
        const userId = await firebaseService.getUserId()
        this.userId = userId
        console.log(this.userId)
    }
    
    renderCurrentTask() {
        this.container.innerHTML = ""
        const currentTask = this.tasks[this.currentTaskId]

        const taskFactory = new TaskFactory(currentTask)
        const view = taskFactory.taskView
        const controller = taskFactory.taskController
        const taskElement = view.render()
        
        this.container.append(taskElement)

        const nextButton = elementCreator("button", "next-task-button", "Следущая задача")
        nextButton.disabled = true
        this.container.append(nextButton)

        view.onCheckAnswerCallback = () => {
            if(taskFactory.taskModel.isTaskCompleted()) {
                nextButton.disabled = false
            }
        }

        if (["translate", "audition"].includes(currentTask.type)) {
            const dropSlotsState = controller.model.updateDropSlot.bind(controller.model)
            controller.model.updateDropSlot = (id, word) => {
                dropSlotsState(id, word)
            }
            const removeDropSlot = controller.model.removeFromDropSlot.bind(controller.model)
            controller.model.removeFromDropSlot = (id) => {
                removeDropSlot(id)
            }
        }

        if(currentTask.type === "pairs") {
            const bindHandleWordClick = controller.handleWordClick.bind(controller)
            controller.handleWordClick = (word, slotElement) => {
                bindHandleWordClick(word, slotElement)
            }
        }

        nextButton.addEventListener("click", () => this.nextTask())
    }

    nextTask() {
        this.currentTaskId++
        if (this.currentTaskId < this.tasks.length) {
            this.renderCurrentTask()
        } else {
            this.renderResults()
        }
    }

    async renderResults() {
        this.container.innerHTML = ""

        await markTaskAsCompleted(this.userId, this.themeName, this.subtaskName)
        console.log(`Задание "${this.subtaskName}" завершено`)

        const subtaskPointsToAdd = calculateUserPoints({
            tasks: this.tasks.length,
            subtusk: true,
            theme: false
        })
        console.log(`Начисленно за subtask:  ${subtaskPointsToAdd}`)
        await addPointsToUser(this.userId, subtaskPointsToAdd)

        const allSubtasks = await getAllSubtasksForTheme(this.themeName)
        console.log(`All subtasks: ${allSubtasks}`)
        const completedTasks = await getCompletedTasks(this.userId)
        console.log(`Completed tasks: ${completedTasks}`)
        const userCompletedTasks = completedTasks[this.themeName] || []
        console.log(`User completed tasks: ${userCompletedTasks}`)

        const allSubtasksCompleted = allSubtasks.length > 0 && allSubtasks.every(subtask => userCompletedTasks.includes(subtask))
        console.log(`Current subtasks completed: ${allSubtasksCompleted}`)

        if (allSubtasksCompleted) {

            const isThemeCompletedBefore = await isThemeCompleted(this.userId, this.themeName)
            console.log(`Is theme completed before: ${isThemeCompletedBefore}`)

            if  (!isThemeCompletedBefore) {

                const themeMarker = await markThemeAsCompleted(this.userId, this.themeName)
                console.log(`Theme marker: ${themeMarker}`)

                if (themeMarker) {
                    const pointsToAdd = calculateUserPoints({
                        tasks: 0,
                        subtusk: false,
                        theme: true
                    })
                    await addPointsToUser(this.userId, pointsToAdd)
                    console.log(`Начисленно за тему:  ${pointsToAdd}`)
                }
            }
        }
        
        const resultsContainer = elementCreator("div", "results-container")
        const resultsText = elementCreator("p", "results-text", "Вы прошли тест!")
        const backToMenuButton = elementCreator("button", "back-to-menu-button", "Назад в меню")

        backToMenuButton.addEventListener("click", () => appRouter.navigate("/home"))
        
        resultsContainer.append(resultsText)
        this.container.append(resultsContainer, backToMenuButton)
    }
}