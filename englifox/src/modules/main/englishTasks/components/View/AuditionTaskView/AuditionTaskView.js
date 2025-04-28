import { elementCreator } from "../../../../../utils/element-creator/elementCreator"
import styles from "../../styles/audition.module.css"
import { BaseTaskView } from "../BaseTaskView/BaseTaskView"

export class AuditionTaskView extends BaseTaskView {
    constructor(model, controller) {
        super(model, controller)
        this.model = model
        this.controller = controller
        this.optionsSlotsMap = new Map()
        this.dropSlotsMap = new Map()
        this.dropSlots = []
        this.shuffledAnswerOptions = []
    }

    render() {
        const container = super.render()
        this.renderQuestion()
        return container
    }

    renderQuestion() {
        const questionContainer = elementCreator("div", styles["question-container"])

        const playQuestionButton = elementCreator("button", styles["play-question-button"], "Прослушать")
        playQuestionButton.addEventListener("click", () => {
            this.controller.playAudio()
        })

        questionContainer.append(playQuestionButton)
        this.taskContainer.append(questionContainer)
    }

    renderAnswerContainer() {
        this.taskAnswerInput = elementCreator("div", styles["task-answer-input"])
        this.answerContainer.append(this.taskAnswerInput)

        this.model.wordsInAnswer.forEach((_, id) => {
            const dropSlot = elementCreator("div", styles["drop-slot"])
            dropSlot.id = `drop-slot-${id}`
            dropSlot.isEmpty = true

            this.controller.enableDropEvents(dropSlot)
            this.controller.enableWordClickEvents(dropSlot)

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
            this.controller.enableWordClickEvents(answerOption)

            this.optionsSlotsMap.set(answerOption.id, answerOption)
            this.answerOptionsContainer.append(answerOption)
        })

    }

    updateAnswerOptions() {
        this.renderAnswerOptions()
    }

    changeDropSlotsColorByAnswer(resultArray) {
        this.dropSlots.forEach((slot, id) => {
            slot.classList.remove(styles["correct-answer"], styles["wrong-answer"])
            slot.classList.add(resultArray[id]? styles["correct-answer"] : styles["wrong-answer"])
        })
    }
}
