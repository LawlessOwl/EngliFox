import { foxyLoader } from "../../../../public/foxyLoader/foxyLoader";
import { elementCreator } from "../element-creator/elementCreator";
import styles from "./styles/style.module.css";

export class LoadingModal {
  constructor() {
    this.modalShadow = elementCreator("div",  styles["modal-shadow"]);
    this.modal = elementCreator("div", styles["modal"]);
    this.modalContent = elementCreator("div", styles["modal-content"]);
    this.modalContent.append(foxyLoader());
    this.modal.append(this.modalContent);
  }

  show() {
    document.body.append(this.modalShadow, this.modal);
    document.body.style.overflow = "hidden";
  }

  hide() {
    this.modalShadow.remove();
    this.modal.remove();
    document.body.style.overflow = "";
  }
}
