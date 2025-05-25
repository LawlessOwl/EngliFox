import { shuffleArray } from "../../../../../utils/array-shuffler/array-shuffler";

export class TaskModel {
    constructor(taskInfo) {
        this.taskInfo = taskInfo

        if (this.taskInfo.type === "translate" || this.taskInfo.type === "audition") {
            this.initTranslateOrAuditionTask()
        }

        if (this.taskInfo.type === "pairs") {
            this.initPairsTask()
        }

        this.subscribers = []
    }

    observer(subscriber) {
        this.subscribers.push(subscriber)
    }

    notifySubscribers(eventType, payload) {
        this.subscribers.forEach(subscriber => {
            subscriber(eventType, payload)
        })
    }

    initTranslateOrAuditionTask() {
        this.wordsInAnswer = this.taskInfo.answer.split(" ")
        this.answerOptions = [...this.taskInfo.answerOptions]
        this.shuffledAnswerOptions = shuffleArray(this.answerOptions)
        this.dropSlotsMap = new Map()
    }

    initPairsTask() {
        this.selectedPairSlot = null
        this.matchedPairs = new Set()

        const ruSlots = this.taskInfo.pairs.map(pair => pair.ru)
        const enSlots = this.taskInfo.pairs.map(pair => pair.en)

        this.shuffledRuSlots = shuffleArray(ruSlots)
        this.shuffledEnSlots = shuffleArray(enSlots)
    }

    getShuffledAnswerOptions() {
        return this.shuffledAnswerOptions
    }

    checkAnswer() {
        let result = false
        if(this.taskInfo.type === "translate" || this.taskInfo.type === "audition") {
            return this.checkTranslateOrAuditionAnswer()
        }

        if(this.taskInfo.type === "pairs") {
            return this.checkPairsAnswer()
        }

        this.notifySubscribers("answerChecked", result)
        return result
    }

    checkTranslateOrAuditionAnswer() {
        return this.wordsInAnswer.map((correctWord, index) => {
            const droppedWord = this.dropSlotsMap.get(`drop-slot-${index}`)
            return this.wordNormalizer(droppedWord) === this.wordNormalizer(correctWord)
        })
    }

    checkPairsAnswer() {
        const totalPairs = this.taskInfo.pairs.length * 2
        return this.matchedPairs.size === totalPairs
    }

    checkPairsMatch(firstWord, secondWord) {
        return this.taskInfo.pairs.some(pair =>
        (pair.ru === firstWord && pair.en === secondWord) ||
        (pair.ru === secondWord && pair.en === firstWord)
        )
    }

    selectPairSlot(word) {
        if (this.selectedPairSlot === null) {
            this.selectedPairSlot = word
            this.notifySubscribers("pairSlotSelected", word)
            return {waiting: true}
        }

        const selected = this.selectedPairSlot
        this.selectedPairSlot = null

        const resultPairs = this.checkPairsMatch(selected, word)
        if (resultPairs) {
            this.matchedPairs.add(selected)
            this.matchedPairs.add(word)
        }

        this.notifySubscribers("pairChecked", {
            waiting: false,
            resultPairs,
            first: selected,
            second: word
        })
        return {waiting: false, resultPairs, first: selected, second : word}
    }

    isMatched(word) {
        return this.matchedPairs.has(word)
    }

    wordNormalizer(word) {
        return word?.trim().replace(/[.,!?]/g, "").toLowerCase()
    }

    updateDropSlot(id, word) {
        this.dropSlotsMap.set(id, word)
        this.notifySubscribers("dropSlotUpdated", {id, word})
    }

    removeFromDropSlot(id) {
        this.dropSlotsMap.delete(id)
        this.notifySubscribers("dropSlotRemoved", id)
    }

    getCurrentAnswerWords() {
        return Array.from(this.dropSlotsMap.values())
    }

    getRemainingOptions() {
        return this.taskInfo.answerOptions.filter(option => !this.getCurrentAnswerWords().includes(option))
    }

    isTaskCompleted() {
        const taskType = this.taskInfo.type
        if (taskType === "translate" || taskType === "audition") {
            return this.wordsInAnswer.length === this.getCurrentAnswerWords().length
        }
        if (taskType === "pairs") {
            return this.taskInfo.pairs.every(pair => this.isMatched(pair.ru) && this.isMatched(pair.en))
        }
        return false
    }

     isAnswerCorrect() {
        const taskType = this.taskInfo.type

        if (taskType === "translate" || taskType === "audition") {
            const checkResult = this.checkTranslateOrAuditionAnswer()
            return Array.isArray(checkResult) ? checkResult.every(isCorrect => isCorrect) : false
        }

        if (taskType === "pairs") {
            return this.checkPairsAnswer()
        }

        return false
    }
}
