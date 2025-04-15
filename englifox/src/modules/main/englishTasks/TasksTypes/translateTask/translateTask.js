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
    const dropSlots = []
    

    wordsInAnswer.forEach((word, index) => {
        const dropSlot = elementCreator("div", styles["drop-slot"])
        dropSlot.id = `drop-slot-${index}`
        dropSlot.isEmpty = true

        dropSlot.addEventListener("dragover", (e) => {
            if (dropSlot.isEmpty) e.preventDefault()
        })
    
        dropSlot.addEventListener("drop", (e) => {
            const draggedElement = e.dataTransfer.getData("text/plain")
            const sourceOptionSlotId = e.dataTransfer.getData("source-slot")
            if (!dropSlot.isEmpty) return

            e.preventDefault()

            for(const [slotId, word] of dropSlotsMap.entries()) {
                if (word === draggedElement) {
                    const slot = optionsSlotsMap.get(slotId)
                    if (slot) {
                        slot.textContent = ""
                        slot.isEmpty = true
                        dropSlotsMap.delete(slotId)
                    }
                }
            }

            dropSlot.textContent = draggedElement
            dropSlot.isEmpty = false
            dropSlotsMap.set(dropSlot.id, draggedElement)

            if(sourceOptionSlotId) {
                const sourceOptionSlot = optionsSlotsMap.get(sourceOptionSlotId)
                if(sourceOptionSlot) {
                    sourceOptionSlot.textContent = ""
                    sourceOptionSlot.classList.add(styles["option-slot-empty"])
                }
            }

            dropSlot.draggable = true
            dropSlot.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", dropSlot.textContent)
                e.dataTransfer.setData("source-slot", dropSlot.id)
                dropSlot.classList.add(styles["option-slot-empty"])
                dropSlot.isEmpty = true
                dropSlotsMap.delete(dropSlot.id)
                requestAnimationFrame(() => {
                    dropSlot.textContent = ""
                })

                const currentDraggedElement = e.dataTransfer.getData("text/plain")
                const onDragEnd = () => {
                    if (!Array.from(dropSlotsMap.values()).includes(currentDraggedElement) &&
                !currentOptions.includes(currentDraggedElement)) {
                    currentOptions.push(currentDraggedElement)
                    updateAnswerOptions(currentOptions)
                }
                 window.removeEventListener("dragend", onDragEnd)
                }
                window.addEventListener("dragend", onDragEnd)
            })

            currentOptions = taskInfo.answerOptions.filter(
                word => !Array.from(dropSlotsMap.values()).includes(word)
            ) 
            updateAnswerOptions(currentOptions)
        })
        dropSlots.push(dropSlot)
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
        const optionsCopy = [...options]
        const shuffledOpptions = shuffleArray(optionsCopy)
        answerOptionsContainer.innerHTML = ""
        shuffledOpptions.forEach((option, id) => {
            const slot = createOptionSlot(option, id)
            answerOptionsContainer.append(slot)
        })
    }

    updateAnswerOptions(currentOptions)

    const checkAnswerButton = elementCreator("button", styles["check-answer-button"], "Проверить ответ")
    const checkAnswer = () => {
        dropSlots.forEach((slot, index) => {
            slot.classList.remove(styles["correct-answer"], styles["wrong-answer"])
            const wordNormalizer = (word) => word?.trim().replace(/[.,!?]/g, "").toLowerCase()
            const droppedWord = dropSlotsMap.get(slot.id)
            const correctWord = wordsInAnswer[index]

            if (wordNormalizer(droppedWord) === wordNormalizer(correctWord)) {
                slot.classList.add(styles["correct-answer"])
                console.log(`правильный ответ: ${droppedWord}`)
                console.log(dropSlotsMap)
                console.log(wordsInAnswer)
                console.log(`сравниваю ${wordNormalizer(droppedWord)} с ${wordNormalizer(correctWord)}`)
            } else {
                slot.classList.add(styles["wrong-answer"])
                console.log(`неправильный ответ: ${droppedWord}`)
            }
        })
    }

    checkAnswerButton.addEventListener("click", checkAnswer)

    taskContainer.append(taskAnswerContainer, answerOptionsContainer, checkAnswerButton)
    return taskContainer
}

//TODO: исправить ошибку с пропаданием слов при перетаскивании
//TODO: добавить проверку на правильность ответа
//TODO: заменить setTimeout на другой способ
//TODO: разбить на классы