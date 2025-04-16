export class TaskModel {
    constructor(taskInfo) {
        this.taskInfo = taskInfo
        this.wordsInAnswer = taskInfo.answer.split(" ")
        this.answerOptions = [...taskInfo.answerOptions]
        this.dropSlotsMap = new Map()
    }

    checkAnswer() {
        const result = this.wordsInAnswer.map((correctWord, index) => {
            const droppedWord = this.dropSlotsMap.get(`drop-slot-${index}`)
            return this.wordNormalizer(droppedWord) === this.wordNormalizer(correctWord)
        })
        return result
    }

    wordNormalizer(word) {
        return word?.trim().replace(/[.,!?]/g, "").toLowerCase()
    }

    updateDropSlot(id, word) {
        this.dropSlotsMap.set(id, word)
    }

    removeFromDropSlot(id) {
        this.dropSlotsMap.delete(id)
    }

    getCurrentAnswerWords() {
        return Array.from(this.dropSlotsMap.values())
    }

    getRemainingOptions() {
        return this.taskInfo.answerOptions.filter(option => !this.getCurrentAnswerWords().includes(option))
    }
}