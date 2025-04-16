import { shuffleArray } from "../../../../array-shuffler/array-shuffler";
import styles from "../../TasksTypes/translateTask/translateTask.module.css"

export class TaskController {
    constructor(model, view) {
        this.model = model
        this.view = view
    }

    enableDropEvents(dropSlot) {
        dropSlot.addEventListener("dragover", (e) => {
            if (dropSlot.isEmpty) e.preventDefault()
        })

        dropSlot.addEventListener("drop", (e) => {
            const draggedWord = e.dataTransfer.getData("text/plain")
            const sourceOptionSlotId = e.dataTransfer.getData("source-slot")
            if (!dropSlot.isEmpty) return

            e.preventDefault()
            this.model.updateDropSlot(dropSlot.id, draggedWord)
            dropSlot.textContent = draggedWord
            dropSlot.isEmpty = false

            const sourceOptionSlot = this.view.optionsSlotsMap.get(sourceOptionSlotId)
            if(sourceOptionSlot) {
                sourceOptionSlot.textContent = ""
                sourceOptionSlot.classList.add(styles["option-slot-empty"])
            }

            dropSlot.draggable = true
            dropSlot.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", dropSlot.textContent)
                e.dataTransfer.setData("source-slot", dropSlot.id)
                dropSlot.classList.remove(styles["option-slot-empty"])
                dropSlot.isEmpty = true
                this.model.removeFromDropSlot(dropSlot.id)
                requestAnimationFrame(() => {
                    dropSlot.textContent = ""
                })

                const currentDraggedWord = e.dataTransfer.getData("text/plain")
                window.addEventListener("dragend", () => {
                    if (
                        !this.model.getCurrentAnswerWords().includes(currentDraggedWord) &&
                        !this.model.answerOptions.includes(currentDraggedWord)
                    ) {
                        this.model.answerOptions.push(currentDraggedWord)
                        this.view.updateAnswerOptions()

                    }
                }, { once: true })
            })
            this.view.updateAnswerOptions()
        })
    }

    enableDragEvents(optionSlot) {
        optionSlot.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", optionSlot.textContent)
            e.dataTransfer.setData("source-slot", optionSlot.id)
        })
    }

    shuffleAnswerOptions() {
        return shuffleArray([...this.model.getRemainingOptions()])
    }

    checkAnswer() {
        const result = this.model.checkAnswer()
        this.view.changeDropSlotsColorByAnswer(result)
    }
}