import { elementCreator } from "../../../../../utils/element-creator/elementCreator.js"
import styles from "../../styles/task.module.css"

export class BaseTaskView {
    constructor(model, controller) {
        this.model = model
        this.controller = controller
        this.taskContainer = null
    }

    createCheckAnswerButton() {
        const checkAnswerButton = elementCreator("button", styles["check-answer-button"], "Проверить ответ")
        checkAnswerButton.addEventListener("click", () => {
            this.controller.checkAnswer()
            if (typeof this.onCheckAnswerCallback === "function") {
                this.onCheckAnswerCallback()
            }
        })
        return checkAnswerButton
    }

    render() {
        this.taskContainer = elementCreator("div", styles["task-container"])
        const taskContent = elementCreator("div", styles["task-content"])
        const taskContentText = elementCreator("div", styles["task-content-text"], this.model.taskInfo.content)
        taskContent.append(taskContentText)

        this.answerContainer = elementCreator("div", styles["answer-container"])
        this.answerOptionsContainer = elementCreator("div", styles["answer-options-container"])

        this.checkAnswerButton = this.createCheckAnswerButton()

        this.taskContainer.append(taskContent, this.answerContainer, this.answerOptionsContainer, this.checkAnswerButton)

        this.renderAnswerContainer()
        this.renderAnswerOptions()

        return this.taskContainer
    }

    renderAnswerContainer() {}
    renderAnswerOptions() {}
}