import { BaseTaskView } from "../BaseTaskView/BaseTaskView.js";
import { elementCreator } from "../../../../../utils/element-creator/elementCreator.js"
import styles from "../../styles/task.module.css"

export class TranslateTaskView extends BaseTaskView {
    constructor(model, controller) {
        super(model, controller)
        this.model = model
        this.controller = controller
        this.optionsSlotsMap = new Map()
        this.dropSlots = []
        this.shuffledAnswerOptions = []
    }

    renderAnswerContainer() {
        this.taskAnswerInput = elementCreator("div", styles["task-answer-input"])
        this.answerContainer.append(this.taskAnswerInput)

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
        if (this.shuffledAnswerOptions.length === 0) {
            this.shuffledAnswerOptions = this.model.getShuffledAnswerOptions()
        }
        this.answerOptionsContainer.innerHTML = ""
        this.optionsSlotsMap.clear()

        this.shuffledAnswerOptions.forEach((option, id) => {
            if (!this.model.getRemainingOptions().includes(option)) return
            const answerOption = elementCreator("div", styles["answer-option"], option)
            answerOption.id = `answer-option-${id}`
            answerOption.draggable = true

            this.controller.enableDragEvents(answerOption)

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