import { elementCreator } from "../../../../../utils/element-creator/elementCreator";
import { BaseTaskView } from "../BaseTaskView/BaseTaskView";
import styles from "../PairsTaskView/styles/PairsTaskStyles.module.css"

export class PairsTaskView extends BaseTaskView {
    constructor(model, controller) {
        super(model, controller)
        this.model = model
        this.controller = controller
        this.slotElements = new Map()
    }

    createPairSlot(word, id) {
        const slot = elementCreator("div", styles["pairs-slot"], word)
        slot.id = id
        slot.addEventListener("click", () => {
            if (!this.model.isMatched(word)) {
                this.controller.handleWordClick(word, slot)
            }
        })
        return slot
    }

    render() {
        this.taskContainer = elementCreator("div", styles["task-container"])
        const pairsColumnWrapper = elementCreator("div", styles["pairs-column-wrapper"])
        const ruPairsColumn = elementCreator("div", styles["pairs-column"])
        const enPairsColumn = elementCreator("div", styles["pairs-column"])

        this.model.shuffledRuSlots.forEach((word, id) => {
            const ruSlot = this.createPairSlot(word, `ru-slot-${id}`)
            this.slotElements.set(word, ruSlot)
            ruPairsColumn.append(ruSlot)
        })

        this.model.shuffledEnSlots.forEach((word, id) => {
            const enSlot = this.createPairSlot(word, `en-slot-${id}`)
            this.slotElements.set(word, enSlot)
            enPairsColumn.append(enSlot)
        })

        pairsColumnWrapper.append(ruPairsColumn, enPairsColumn)

        const checkAnswerButton = elementCreator("button", styles["check-answer-button"], "Проверить ответ")
        checkAnswerButton.addEventListener("click", () => this.controller.checkAnswer())

        this.taskContainer.append(pairsColumnWrapper, checkAnswerButton)
        return this.taskContainer
    }

    clearHighlights() {
        this.slotElements.forEach((slot, word) => {
            if(!this.model.isMatched(word)) {
                slot.classList.remove(styles["correct-pair"], styles["wrong-pair"], styles["active-slot"])
            } else {
                slot.classList.remove(styles["wrong-pair"])
            }
        })
    }

    higlightPairs(firstWord, secondWord, isCorrect) {
        const firstSlot = this.slotElements.get(firstWord)
        const secondSlot = this.slotElements.get(secondWord)
        
        if (!firstSlot || ! secondSlot) return

        const classNameByResult = isCorrect ? styles["correct-pair"] : styles["wrong-pair"]
        firstSlot.classList.add(classNameByResult)
        secondSlot.classList.add(classNameByResult)
    }
}