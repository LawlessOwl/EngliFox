import { appRouter } from "../../App.js"
import { elementCreator } from "../utils/element-creator/elementCreator.js"

class AuthForm {
    constructor(type) {
        this.form = elementCreator("form", `${type}-form`)

        this.usernameInput = elementCreator("input", `${type}-username-input`)
        this.usernameInput.type = "text"
        this.usernameInput.placeholder = "Введите ваше имя пользователя"

        this.passwordInput = elementCreator("input", `${type}-password-input`)
        this.passwordInput.type = "password"
        this.passwordInput.placeholder = "Введите ваш пароль"

        this.sendFormButton = elementCreator("button", `${type}-send-form`, "Отправить")
        this.sendFormButton.type = "submit"

        this.form.append(this.usernameInput, this.passwordInput, this.sendFormButton)
    }

    validateUserInputs() {
        const username = this.usernameInput.value.trim()
        const password = this.passwordInput.value.trim()
        if (
            username !== "" && 
            username.length >= 6 && 
            password !== "" && 
            password.length >= 6
            ) {
            this.sendFormButton.removeAttribute("disabled")
        } else {
            this.sendFormButton.setAttribute("disabled", "true")
        }
    }

    checkUserInfo() {
        const userDataFromStorage = localStorage.getItem("userInfo")
        if (!userDataFromStorage) return false 

        const userInfo = JSON.parse(userDataFromStorage)
        return(
            this.usernameInput.value === userInfo.username && 
            this.passwordInput.value === userInfo.userPassword
        )
    }

    getForm() {
        return this.form
    }
}

class RegistrationForm extends AuthForm {
        constructor() {
            super("registration")
            this.emailInput = elementCreator("input", "email-input")
            this.emailInput.type = "email"
            this.emailInput.placeholder = "Введите ваш имейл"
            this.form.prepend(this.emailInput)

            this.emailInput.addEventListener("input", () => this.validateUserInputs())
            this.usernameInput.addEventListener("input", () => this.validateUserInputs())
            this.passwordInput.addEventListener("input", () => this.validateUserInputs())
            this.form.addEventListener("submit", (e) => this.sendUserInfo(e))
        }
        validateUserInputs() {
            const email = this.emailInput.value.trim()
            const username = this.usernameInput.value.trim()
            const password = this.passwordInput.value.trim()
        if (
            email !== "" && 
            email.length > 6 && 
            email.includes("@") &&
            username !== "" && 
            username.length >= 6 && 
            password !== "" && 
            password.length >= 6
            ) {
            this.sendFormButton.removeAttribute("disabled")
        } else {
            this.sendFormButton.setAttribute("disabled", "true")
        }
        }

        sendUserInfo(e) {
            e.preventDefault()
        
            let isUserAlreadyExist = this.checkUserInfo()
            if (isUserAlreadyExist) {
                return
            } 
            let userInfoObj = {
                userEmail: this.emailInput.value,
                username: this.usernameInput.value,
                userPassword: this.passwordInput.value
            }
            
            localStorage.setItem("userInfo", JSON.stringify(userInfoObj))
            this.emailInput.value = ""
            this.usernameInput.value = ""
            this.passwordInput.value = ""
            super.validateUserInputs()
        }
}

class LoginForm extends AuthForm {
    constructor() {
        super("login")
        this.usernameInput.addEventListener("input", () => this.validateUserInputs())
        this.passwordInput.addEventListener("input", () => this.validateUserInputs())

        this.form.addEventListener("submit", (e) => this.authStatus(e))
    }
    authStatus(e) {
            e.preventDefault()
            const testErrDiv = elementCreator("div", "err", "err")
            let isUserInputsCorrect = this.checkUserInfo()
            if (isUserInputsCorrect) {
                appRouter.navigate("/home")
            } else {
                document.body.append(testErrDiv)
            }
        }
}

export const renderAuth = () => {
    const authWindow = elementCreator("div", "authentication-window")

const goToRegistrationButton = elementCreator("button", "registration-button", "Регистрация")

const goToLoginButton = elementCreator("button", "login-button", "Войти")

const registrationModalWindow = elementCreator("div", "registration-modal-window", null, {
    display: "none"
})

const loginModalWindow = elementCreator("div", "login-modal-window", null, {
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

registrationForm.validateUserInputs()
loginForm.validateUserInputs()
return authWindow
}