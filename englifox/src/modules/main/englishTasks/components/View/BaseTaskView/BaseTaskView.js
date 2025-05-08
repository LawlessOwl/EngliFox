import { elementCreator } from "../../../../../utils/element-creator/elementCreator.js"
import styles from "../../styles/task.module.css"

export class BaseTaskView {
    constructor(model, controller) {
        this.model = model
        this.controller = controller
        this.taskContainer = null
        this.optionsSlotsMap = new Map()
        this.dropSlotsMap = new Map()
        this.dropSlots = []
        this.shuffledAnswerOptions = []
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

        if(this.model.taskInfo.type === "audition") {
            this.taskContainer.append(this.answerContainer, this.answerOptionsContainer, this.checkAnswerButton)
        } else {
            this.taskContainer.append(taskContent, this.answerContainer, this.answerOptionsContainer, this.checkAnswerButton)
        }



        this.renderAnswerContainer()
        this.renderAnswerOptions()

        return this.taskContainer
    }

    renderAnswerContainer() {
        this.taskAnswerInput = elementCreator("div", styles["task-answer-input"])
        this.answerContainer.append(this.taskAnswerInput)

        this.model.wordsInAnswer.forEach((_, id) => {
            const dropSlot = elementCreator("div", styles["drop-slot"])
            dropSlot.id = `drop-slot-${id}`
            dropSlot.isEmpty = true

            this.controller.enableDropEvents(dropSlot)
            if (window.innerWidth < 768) {
                this.controller.enableWordClickEvents(dropSlot)
            }

            this.dropSlots.push(dropSlot)
            this.dropSlotsMap.set(dropSlot.id, dropSlot)
            this.taskAnswerInput.append(dropSlot)
        })
    }

    renderAnswerOptions() {
        if (this.shuffledAnswerOptions.length === 0) {
            this.shuffledAnswerOptions = this.model.getShuffledAnswerOptions()
        }
        this.answerOptionsContainer.innerHTML = ""
        this.optionsSlotsMap.clear()

        this.shuffledAnswerOptions.forEach((option, id) => {
            if (!this.model.getRemainingOptions().includes(option)) {
                const emptyOptionSlot = elementCreator("div", styles["answer-option"])
                emptyOptionSlot.id = `answer-option-${id}`
                emptyOptionSlot.classList.add(styles["option-slot-empty"])
                this.optionsSlotsMap.set(emptyOptionSlot.id, emptyOptionSlot)
                this.answerOptionsContainer.append(emptyOptionSlot)
                return
            }

            const answerOption = elementCreator("div", styles["answer-option"], option)
            answerOption.id = `answer-option-${id}`
            answerOption.draggable = true

            this.controller.enableDragEvents(answerOption)
            this.controller.enableDropEvents(answerOption)
            if (window.innerWidth < 768) {
                this.controller.enableWordClickEvents(answerOption)
            }

            this.optionsSlotsMap.set(answerOption.id, answerOption)
            this.answerOptionsContainer.append(answerOption)
        })
    }

    updateAnswerOptions() {
        this.renderAnswerOptions()
    }

    updateDropSlots() {
        this.renderAnswerContainer()
    }

    changeDropSlotsColorByAnswer(resultArray) {
        this.dropSlots.forEach((slot, id) => {
            slot.classList.remove(styles["correct-answer"], styles["wrong-answer"])
            slot.classList.add(resultArray[id]? styles["correct-answer"] : styles["wrong-answer"])
        })
    }
}
