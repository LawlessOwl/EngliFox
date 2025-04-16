import { elementCreator } from "../../../../element-creator/elementCreator.js";
import styles from "../../TasksTypes/translateTask/translateTask.module.css"


export class TranslateTaskView {
    constructor(model, controller) {
        this.model = model
        this.controller = controller
        this.optionsSlotsMap = new Map()
        this.dropSlots = []
    }

    render() {
        this.taskContainer = elementCreator("div", styles["task-container"])
        const taskContent = elementCreator("div", styles["task-content"])
        const taskContentText = elementCreator("div", styles["task-content-text"], this.model.taskInfo.content)
        taskContent.append(taskContentText)

        this.taskAnswerInput = elementCreator("div", styles["task-answer-input"])
        const taskAnswerContainer = elementCreator("div", styles["task-answer-container"])
        taskAnswerContainer.append(this.taskAnswerInput)

        this.answerOptionsContainer = elementCreator("div", styles["answer-options-container"])

        const checkAnswerButton = elementCreator("button", styles["check-answer-button"], "Проверить ответ")
        checkAnswerButton.addEventListener("click", () => {
            this.controller.checkAnswer()
        })

        this.taskContainer.append(taskContent, taskAnswerContainer, this.answerOptionsContainer, checkAnswerButton)

        this.renderDropSlots()
        this.renderAnswerOptions()

        return this.taskContainer
    }

    renderDropSlots() {
        this.model.wordsInAnswer.forEach((_, id) => {
            const dropSlot = elementCreator("div", styles["drop-slot"])
            dropSlot.id = `drop-slot-${id}`
            dropSlot.isEmpty = true

            this.controller.enableDropEvents(dropSlot)

            this.dropSlots.push(dropSlot)
            this.taskAnswerInput.append(dropSlot)
        })
    }

    renderAnswerOptions() {
        const shuffledAnswerOptions = this.controller.shuffleAnswerOptions()
        this.answerOptionsContainer.innerHTML = ""

        shuffledAnswerOptions.forEach((option, id) => {
            const optionSlot = elementCreator("div", styles["option-slot"])
            optionSlot.id = `option-slot-${id}`
            optionSlot.draggable = true
            optionSlot.textContent = option

            this.controller.enableDragEvents(optionSlot)

            this.optionsSlotsMap.set(optionSlot.id, optionSlot)
            this.answerOptionsContainer.append(optionSlot)
        })
    }

    changeDropSlotsColorByAnswer(resultArray) {
        this.dropSlots.forEach((slot, id) => {
            slot.classList.remove(styles["correct-answer"], styles["wrong-answer"])
            slot.classList.add(resultArray[id]? styles["correct-answer"] : styles["wrong-answer"])
        })
    }

    updateAnswerOptions() {
        this.renderAnswerOptions()
    }
}