import { tasksLibrary } from "../../englishTasks";
import { elementCreator } from "../../../../element-creator/elementCreator";
import { shuffleArray } from "../../../../array-shuffler/array-shuffler";
import styles from "./translateTask.module.css"

export const renderTranslateTask = (taskInfo) => {
    const taskContainer = elementCreator("div", styles["task-container"])

    const taskContent = elementCreator("div", styles["task-content"])
    const taskContentText = elementCreator("div", styles["task-content-text"], taskInfo.content)
    taskContent.append(taskContentText)
    taskContainer.append(taskContent)

    const taskAnswerContainer = elementCreator("div", styles["task-answer-container"])
    const taskAnswerInput = elementCreator("div", styles["task-answer-input"])
    taskAnswerContainer.append(taskAnswerInput)
    const wordsInAnswer = taskInfo.answer.split(" ")
    let currentOptions = [...taskInfo.answerOptions]

    const optionsSlotsMap = new Map()
    const dropSlotsMap = new Map()
    

    wordsInAnswer.forEach(word => {
        const dropSlot = elementCreator("div", styles["drop-slot"])
        dropSlot.isEmpty = true

        dropSlot.addEventListener("dragover", (e) => {
            if (dropSlot.isEmpty) e.preventDefault()
        })
    
        dropSlot.addEventListener("drop", (e) => {
            const draggedElement = e.dataTransfer.getData("text/plain")
            const sourceOptionSlotId = e.dataTransfer.getData("source-slot")
            if (!dropSlot.isEmpty) return

            e.preventDefault()

            for(const [slot, word] of dropSlotsMap.entries()) {
                if (word === draggedElement) {
                    slot.textContent = ""
                    slot.isEmpty = true
                    dropSlotsMap.delete(slot)
                }
            }

            dropSlot.textContent = draggedElement
            dropSlot.isEmpty = false
            dropSlotsMap.set(dropSlot, draggedElement)

            if(sourceOptionSlotId) {
                const soruceOptionSlot = optionsSlotsMap.get(sourceOptionSlotId)
                soruceOptionSlot.textContent = ""
                soruceOptionSlot.classList.add(styles["option-slot-empty"])
            }

            dropSlot.draggable = true
            dropSlot.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", dropSlot.textContent)
                e.dataTransfer.setData("source-slot", dropSlot.id)
                dropSlot.classList.add(styles["option-slot-empty"])
                dropSlot.isEmpty = true
                dropSlotsMap.delete(dropSlot)
                setTimeout(() => dropSlot.textContent = "", 0)
            })

            currentOptions = currentOptions.filter(option => option !== draggedElement)
            updateAnswerOptions(currentOptions)
        })
        taskAnswerInput.append(dropSlot)
    })
    
    const answerOptionsContainer = elementCreator("div", styles["answer-options-container"])

    const createOptionSlot = (option, index) => {
        const optionSlot = elementCreator("div", styles["option-slot"], option)
        optionSlot.id = `option-slot-${index}`
        optionSlot.originOptionWord = option
        optionSlot.draggable = true

        optionSlot.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", optionSlot.textContent)
            e.dataTransfer.setData("source-slot", optionSlot.id)
        })

        optionsSlotsMap.set(optionSlot.id, optionSlot)
        return optionSlot
    }

    answerOptionsContainer.addEventListener("dragover", (e) => {
        e.preventDefault()
    })

    answerOptionsContainer.addEventListener("drop", (e) => {
        e.preventDefault()
        const draggedElement = e.dataTransfer.getData("text/plain")
        if(!currentOptions.includes(draggedElement)) {
            currentOptions.push(draggedElement)
            updateAnswerOptions(currentOptions)
        }
    })


    const updateAnswerOptions = (options) => {
        answerOptionsContainer.innerHTML = ""
        shuffleArray(options).forEach((option, id) => {
            const slot = createOptionSlot(option, id)
            answerOptionsContainer.append(slot)
        })
    }

    updateAnswerOptions(currentOptions)

    taskContainer.append(taskAnswerContainer, answerOptionsContainer)
    return taskContainer
}

//TODO: исправить ошибку с пропаданием слов при перетаскивании
//TODO: добавить проверку на правильность ответа
//TODO: заменить setTimeout на другой способ
//TODO: разбить на классы