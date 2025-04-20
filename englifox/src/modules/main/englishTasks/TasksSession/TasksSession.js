import { appRouter } from "../../../../App.js"
import { elementCreator } from "../../../utils/element-creator/elementCreator.js"
import { TaskFactory } from "../components/TaskFactory/TaskFactory.js"

export class TasksSession {
    constructor(tasksArray, container) {
        this.tasks = tasksArray
        this.container = container
        this.currentTaskId = 0
        this.renderCurrentTask()
    }
    
    renderCurrentTask() {
        this.container.innerHTML = ""
        const currentTask = this.tasks[this.currentTaskId]

        const taskFactory = new TaskFactory(currentTask)
        const view = taskFactory.taskView
        const taskElement = view.render()
        
        this.container.append(taskElement)

        const nextButton = elementCreator("button", "next-task-button", "Следущая задача")
        nextButton.addEventListener("click", () => this.nextTask())
        this.container.append(nextButton)
    }

    nextTask() {
        this.currentTaskId++
        if (this.currentTaskId < this.tasks.length) {
            this.renderCurrentTask()
        } else {
            this.renderResults()
        }
    }

    renderResults() {
        this.container.innerHTML = ""
        const resultsContainer = elementCreator("div", "results-container")
        const resultsText = elementCreator("p", "results-text", "Вы прошли тест!")
        const backToMenuButton = elementCreator("button", "back-to-menu-button", "Назад в меню")
        backToMenuButton.addEventListener("click", () => appRouter.navigate("/"))
        resultsContainer.append(resultsText)
        this.container.append(resultsContainer, backToMenuButton)
    }
}