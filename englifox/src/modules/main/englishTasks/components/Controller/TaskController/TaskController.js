import { textToSpeak } from "../../../../../utils/text-to-speak/text-to-speak";
import styles from "../../styles/task.module.css";

export class TaskController {
    constructor(model, view) {
        this.model = model
        this.view = view

        this.model.observer(this.handleModelChange.bind(this))
    }

    handleModelChange() {

    }

    handleWordClick(word, slotElement) {
        if (this.model.isMatched(word)) return

        const result = this.model.selectPairSlot(word)

        this.view.clearHighlights()

        if (result.waiting) {
            this.view.highlightActiveSlot(slotElement)
        } else {
            this.view.clearHighlights()
            this.view.higlightPairs(result.first, result.second, result.resultPairs)
        }
    }

    async playAudio() {
       try {
        await textToSpeak(this.model.taskInfo.content, this.model.taskInfo.lang)
       } catch (error) {
        console.error("Error playing audio:", error);
       }
    }


    enableWordClickEvents(optionSlotElement) {
        optionSlotElement.addEventListener("click", (e) => {
            const word = optionSlotElement.textContent
            if (!word) return

            if (this.view.optionsSlotsMap.has(optionSlotElement.id)) {
                const emptySlot = Array.from(this.view.dropSlotsMap.values()).find((slot) => slot.isEmpty)

                if (emptySlot) {
                    emptySlot.textContent = word
                    emptySlot.isEmpty = false

                    this.model.updateDropSlot(emptySlot.id, word)

                    optionSlotElement.textContent = ""
                    optionSlotElement.classList.add(styles["option-slot-empty"])
                    optionSlotElement.isEmpty = true

                    this.model.answerOptions = this.model.answerOptions.filter((option) => option !== word)

                    this.view.renderAnswerOptions()
                    this.view.optionsSlotsMap.forEach((slot) => {
                        if (slot.textContent && !slot.draggable) {
                            slot.draggable = true
                            slot.enableDragEvents(slot)
                        }
                    })
                }
            }

            if (this.view.dropSlotsMap.has(optionSlotElement.id)) {
                const wordInDropSlot = optionSlotElement.textContent
                if (!wordInDropSlot) return

                const emptyOptionSlot = Array.from(this.view.optionsSlotsMap.values()).find((slot) => !slot.isEmpty)

                if (emptyOptionSlot) {
                    emptyOptionSlot.textContent = wordInDropSlot
                    emptyOptionSlot.classList.remove(styles["option-slot-empty"])
                    emptyOptionSlot.isEmpty = false

                    optionSlotElement.textContent = ""
                    optionSlotElement.isEmpty = true

                    this.model.removeFromDropSlot(optionSlotElement.id)
                    this.model.answerOptions.push(wordInDropSlot)

                    this.view.renderAnswerOptions()
                }
            }

        })
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

                this.view.updateAnswerOptions()

                const currentDraggedWord = e.dataTransfer.getData("text/plain")
                window.addEventListener("dragend", () => {
                    const isInDropSlot = this.model.getCurrentAnswerWords().includes(currentDraggedWord)
                    const isInOptionSlot = this.model.answerOptions.includes(currentDraggedWord)

                    if(!isInDropSlot && !isInOptionSlot) {
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

    checkAnswer() {
        const taskType = this.model.taskInfo.type
        if (taskType === "translate" || taskType === "audition") {
            const result = this.model.checkAnswer()
            this.view.changeDropSlotsColorByAnswer(result)
        }
        if (taskType === "pairs") {
            this.model.taskInfo.pairs.forEach(pair => {
                const {ru, en} = pair
                const result = this.model.checkPairsMatch(ru, en)
                if (this.model.isMatched(ru) && this.model.isMatched(en)) {
                    this.view.higlightPairs(ru, en, result)
                }
            });
            const allPairsMatched = this.model.taskInfo.pairs.every(pair => this.model.isMatched(pair.ru) && this.model.isMatched(pair.en))
            if (allPairsMatched) {
                console.log("Все пары совпали")
                this.view.onCheckAnswerCallback()
            }
        }
    }
}
