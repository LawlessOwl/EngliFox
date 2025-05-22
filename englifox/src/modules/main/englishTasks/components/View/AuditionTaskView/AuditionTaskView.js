import { elementCreator } from "../../../../../utils/element-creator/elementCreator"
import styles from "../../styles/audition.module.css"
import { BaseTaskView } from "../BaseTaskView/BaseTaskView"

export class AuditionTaskView extends BaseTaskView {
    constructor(model, controller) {
        super(model, controller)
        this.model = model
        this.controller = controller
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
}
