import { BaseTaskView } from "../BaseTaskView/BaseTaskView.js";

export class TranslateTaskView extends BaseTaskView {
    constructor(model, controller) {
        super(model, controller)
        this.model = model
        this.controller = controller
    }
}
