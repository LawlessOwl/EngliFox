import {TaskModel} from "../Model/TaskModel/TaskModel.js";
import { TranslateTaskView } from "../View/TranslateTaskView/TranslateTaskView.js";
import { AuditionTaskView } from "../View/AuditionTaskView/AuditionTaskView.js";
import { TaskController } from "../Controller/TaskController/TaskController.js";
import { PairsTaskView } from "../View/PairsTaskView/PairsTaskView.js";

export class TaskFactory {
    constructor(taskInfo) {
        this._taskInfo = taskInfo
        this._taskModel = new TaskModel(this._taskInfo)
        this._taskController = new TaskController(this._taskModel, null)
        this._taskView = this._createTaskView()
        this._taskController.view = this._taskView
    }

    _createTaskView() {
        switch (this._taskInfo.type) {
        case "translate":
           return new TranslateTaskView(this._taskModel, this._taskController)
        case "audition":
           return new AuditionTaskView(this._taskModel, this._taskController)
        case "pairs":
            return new PairsTaskView(this._taskModel, this._taskController)
        default:
            throw new Error("Unknown task type")
        }
    }

    get taskView() {
        return this._taskView
    }
    get taskModel() {
        return this._taskModel
    }
    get taskController() {
        return this._taskController
    }
}