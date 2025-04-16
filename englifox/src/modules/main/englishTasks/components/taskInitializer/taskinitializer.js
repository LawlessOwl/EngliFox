import {TaskModel} from "../../components/TaskModel/TaskModel.js";
import { TranslateTaskView } from "../TaskView/TranslateTaskView.js";
import { TaskController } from "../TaskController/TaskController.js";

export const initializeTask = (taskInfo) => {
    const model = new TaskModel(taskInfo)
    const view = new TranslateTaskView(model, null)
    const controller = new TaskController(model, view)
    view.controller = controller
    return view.render()
}