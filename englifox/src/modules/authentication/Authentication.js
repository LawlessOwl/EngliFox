import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { appRouter } from "../../App.js";
import { ConfirmModal } from "../utils/confirm-modal/confirm-modal.js";
import { elementCreator } from "../utils/element-creator/elementCreator.js";
import { auth } from "../utils/firebase/firebase.js";
import { firebaseService } from "../utils/firebase/FirebaseService/FirebaseService.js";
import { LoadingModal } from "../utils/loadingModal/loadingModal.js";
import styles from "./Authentication.module.css";

class AuthForm {
    constructor(type) {
        this.form = elementCreator("form", styles[`${type}-form`])

        this.emailContainer = elementCreator("div", styles["input-container"])
        this.emailInput = elementCreator("input", styles[`${type}-email-input`])
        this.emailInput.type = "email"
        this.emailInput.placeholder = "Введите ваш имейл"
        this.emailContainer.append(this.emailInput)

        this.passwordContainer = elementCreator("div", styles["input-container"])
        this.passwordInput = elementCreator("input", styles[`${type}-password-input`])
        this.passwordInput.type = "password"
        this.passwordInput.placeholder = "Введите ваш пароль"
        this.passwordContainer.append(this.passwordInput)

        this.sendFormButton = elementCreator("button", styles[`${type}-send-form`], "Отправить")
        this.sendFormButton.type = "submit"

        this.LoadingModal = new LoadingModal()

        this.emailInput.addEventListener("input", () => this.validateField("email"))
        this.passwordInput.addEventListener("input", () => this.validateField("password"))

        this.form.append(this.emailContainer, this.passwordContainer, this.sendFormButton)
    }

    validateField(fieldType) {
        switch (fieldType) {
            case "email":
                const email = this.emailInput.value.trim()
                const isEmailValid = email !== "" && email.length > 6 && email.includes("@")
                this.showOrRemoveError(this.emailContainer, "Некорректный имейл", isEmailValid)
                break
            case "password":
                const password = this.passwordInput.value.trim()
                const isPasswordValid = password !== "" && password.length >= 6
                this.showOrRemoveError(this.passwordContainer, "Пароль должен быть длиннее 6-ти символов", isPasswordValid)
                break
        }
    }

    validateUserInputs(shouldShowErrors = false) {
        const email = this.emailInput.value.trim()
        const password = this.passwordInput.value.trim()

        const isEmailValid = email !== "" && email.length > 6 && email.includes("@")
        const isPasswordValid = password !== "" && password.length >= 6

        if (shouldShowErrors) {
            this.showOrRemoveError(this.emailContainer, "Некорректный имейл", isEmailValid)
            this.showOrRemoveError(this.passwordContainer, "Пароль должен быть длиннее 6-ти символов", isPasswordValid)
        }

        return isEmailValid && isPasswordValid
    }

    showOrRemoveError(container, errorMessage, condition) {
        const existingErrorElement = container.querySelector(`.${styles["input-error"]}`)

        if (!condition) {
            if (!existingErrorElement) {
                const errorElement = elementCreator("p", styles["input-error"], errorMessage)
                container.append(errorElement)
            }
        } else {
            if (existingErrorElement) {
                existingErrorElement.remove()
            }
        }
    }

    removeAllErrors() {
        const errorElements = this.form.querySelectorAll(`.${styles["input-error"]}`)
        errorElements.forEach(element => element.remove())
    }

    getForm() {
        return this.form
    }
}

class RegistrationForm extends AuthForm {
    constructor() {
        super("registration")

        this.usernameContainer = elementCreator("div", styles["input-container"])
        this.usernameInput = elementCreator("input", styles[`username-input`])
        this.usernameInput.type = "text"
        this.usernameInput.placeholder = "Введите ваше имя пользователя"
        this.usernameContainer.append(this.usernameInput)

        this.usernameInput.addEventListener("input", () => this.validateField("username"))

        this.form.prepend(this.usernameContainer)

        this.form.addEventListener("submit", (e) => this.sendUserInfo(e))
    }

    validateField(fieldType) {
        if (fieldType === "username") {
            const username = this.usernameInput.value.trim()
            const isUsernameValid = username !== "" && username.length >= 6
            this.showOrRemoveError(this.usernameContainer, "Имя пользователя должно быть длиннее 6-ти символов", isUsernameValid)
        } else {
            super.validateField(fieldType)
        }
    }

    validateUserInputs(shouldShowErrors = false) {
        const email = this.emailInput.value.trim()
        const username = this.usernameInput.value.trim()
        const password = this.passwordInput.value.trim()

        const isEmailValid = email !== "" && email.length > 6 && email.includes("@")
        const isPasswordValid = password !== "" && password.length >= 6
        const isUsernameValid = username !== "" && username.length >= 6

        if (shouldShowErrors) {
            this.showOrRemoveError(this.usernameContainer, "Имя пользователя должно быть длиннее 6-ти символов", isUsernameValid)
            this.showOrRemoveError(this.emailContainer, "Имейл должен быть длиннее 6-ти символов", isEmailValid)
            this.showOrRemoveError(this.passwordContainer, "Пароль должен быть длиннее 6-ти символов", isPasswordValid)
        } else {
            this.removeAllErrors()
        }

        return isEmailValid && isPasswordValid && isUsernameValid
    }

    sendUserInfo(e) {
        e.preventDefault()

        const isValid = this.validateUserInputs(true)
        if (!isValid) return

        this.LoadingModal.show()

        const email = this.emailInput.value.trim()
        const username = this.usernameInput.value.trim()
        const password = this.passwordInput.value.trim()

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user

            return sendEmailVerification(user).then(() => {
                const userId = user.uid

                const userInfo = {
                    username,
                    points: 0,
                    completedTasks: {},
                }

                return firebaseService.writeUserData(userId, userInfo)
            })
        })
        .then(async () => {
            const modal = new ConfirmModal({
                message: "Регистрация успешна! На ваш email отправлено письмо для подтверждения регистрации. Пожалуйста, проверьте почту и подтвердите свой аккаунт.",
                confirmButtonText: "Ок",
                showCancelButton: false
            })
            await modal.showModal()

            this.emailInput.value = ""
            this.usernameInput.value = ""
            this.passwordInput.value = ""
            this.validateUserInputs(false)
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(`Проблема проблема: ${errorCode} - ${errorMessage}`)
        })
        .finally(() => {
            this.LoadingModal.hide()
        })
    }
}

class LoginForm extends AuthForm {
    constructor(auth) {
        super("login")

        this.form.addEventListener("submit", (e) => this.authStatus(e))
    }

    authStatus(e) {
        e.preventDefault()

        const isValid = this.validateUserInputs(true)
        if (!isValid) return

        this.LoadingModal.show()

        const email = this.emailInput.value.trim()
        const password = this.passwordInput.value.trim()

        signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user


            if (!user.emailVerified) {

                const existingErrorElement = this.form.querySelector(`.${styles["error-element"]}`)
                if (existingErrorElement) {
                    existingErrorElement.remove()
                }

                const errorElement = elementCreator("p", styles["error-element"],
                    "Пожалуйста, подтвердите ваш email адрес. Проверьте почту и перейдите по ссылке в письме.")
                this.form.append(errorElement)

                const resendButton = elementCreator("button", styles["resend-verification-button"], "Отправить письмо повторно")
                resendButton.type = "button"
                resendButton.addEventListener("click", () => this.resendVerificationEmail(user))
                this.form.append(resendButton)

                return
            }

            const userProfile = await firebaseService.readUserData(user.uid)

            if (userProfile) {
                appRouter.navigate("/home")
            } else {
                console.log("Пользователь не найден")
            }
        })
        .catch((error) => {
            const existingErrorElement = this.form.querySelector(`.${styles["error-element"]}`)
            if (existingErrorElement) {
                existingErrorElement.remove()
            }

            const errorElement = elementCreator("p", styles["error-element"], `произошла ошибочка: введите правильный email и пароль`)
            this.form.append(errorElement)
        })
        .finally(() => {
            this.LoadingModal.hide()
        })
    }

    async resendVerificationEmail(user) {
        try {
            this.LoadingModal.show()
            await sendEmailVerification(user)

            const modal = new ConfirmModal({
                message: "Письмо для подтверждения отправлено повторно. Проверьте вашу почту.",
                confirmButtonText: "Ок",
                showCancelButton: false
            })
            await modal.showModal()

            const resendButton = this.form.querySelector(`.${styles["resend-verification-button"]}`)
            if (resendButton) {
                resendButton.remove()
            }
        } catch (error) {
            console.log("Ошибка при отправке письма:", error)
            const modal = new ConfirmModal({
                message: "Не удалось отправить письмо. Попробуйте позже.",
                confirmButtonText: "Ок",
                showCancelButton: false
            })
            await modal.showModal()
        } finally {
            this.LoadingModal.hide()
        }
    }
}

export const renderAuth = () => {
    const authWindow = elementCreator("div", styles["authentication-window"])

    const goToRegistrationButton = elementCreator("button", styles["registration-button"], "Регистрация")

    const goToLoginButton = elementCreator("button", styles["login-button"], "Войти")

    const registrationModalWindow = elementCreator("div", styles["registration-modal-window"], null, {
        display: "none"
    })

    const loginModalWindow = elementCreator("div", styles["login-modal-window"], null, {
        display: "none"
    })

    const openRegistrationModal = () => {
        registrationModalWindow.style.display = "block"
        loginModalWindow.style.display = "none"
    }

    const openLoginModal = () => {
        loginModalWindow.style.display = "block"
        registrationModalWindow.style.display = "none"
    }

    goToRegistrationButton.addEventListener("click", openRegistrationModal)
    goToLoginButton.addEventListener("click", openLoginModal)

    const registrationForm = new RegistrationForm()
    const loginForm = new LoginForm()

    registrationModalWindow.append(registrationForm.getForm())
    loginModalWindow.append(loginForm.getForm())

    authWindow.append(goToRegistrationButton, goToLoginButton, registrationModalWindow, loginModalWindow)

    return authWindow
}
