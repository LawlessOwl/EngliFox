const elementCreator = (tagName, className, textContent, style) => {
    const element = document.createElement(tagName)
    element.classList.add(className)
    
    if(textContent) {
        element.textContent = textContent
    }

    if (style) {
        Object.entries(style).forEach(([key, value]) => {
          element.style[key] = value;
        });
    }

    return element;
}

class AuthForm {
    constructor(type) {
        this.form = elementCreator("form", `${type}-form`)

        this.usernameInput = elementCreator("input", `${type}-username-input`)
        this.usernameInput.type = "text"
        this.usernameInput.placeholder = "Введите ваше имя"

        this.passwordInput = elementCreator("input", `${type}-password-input`)
        this.passwordInput.type = "password"
        this.passwordInput.placeholder = "Введите ваш пароль"

        this.sendFormButton = elementCreator("button", `${type}-send-form`, "Отправить")
        this.sendFormButton.type = "submit"

        this.form.append(this.usernameInput, this.passwordInput, this.sendFormButton)
    }

    validateUserInputs() {
        if (
            this.usernameInput.value.trim() !== "" && 
            this.usernameInput.value.length >= 6 && 
            this.passwordInput.value.trim() !== "" && 
            this.passwordInput.value.length >= 6
            ) {
            this.sendFormButton.removeAttribute("disabled")
        } else {
            this.sendFormButton.setAttribute("disabled", "true")
        }
    }

    sendUserInfo(e) {
        e.preventDefault()
    
        let userInfoObj = {
            username: this.usernameInput.value,
            userPassword: this.passwordInput.value
        }
    
        localStorage.setItem("userInfo", JSON.stringify(userInfoObj))
        this.usernameInput.value = ""
        this.passwordInput.value = ""
        this.validateUserInputs()
    }

    checkUserInfo(e) {
        e.preventDefault()
        let okStatusTestDiv = elementCreator("div", "OK", "OK")
        let declineStatusTestDiv = elementCreator("div", "decline", "decline")

        const userDataFromStorage = localStorage.getItem("userInfo")
        if (userDataFromStorage) {
            const userInfo = JSON.parse(userDataFromStorage)
            if (this.usernameInput.value === userInfo.username && this.passwordInput.value === userInfo.userPassword) {
                document.body.append(okStatusTestDiv)
            } else {
                document.body.append(declineStatusTestDiv)
            }
        }
    }

    getForm() {
        return this.form
    }
}

const authWindow = elementCreator("div", "authentication-window")

const goToRegistrationButton = elementCreator("button", "registration-button", "Регистрация")

const goToLoginButton = elementCreator("button", "login-button", "Войти")

const registrationModalWindow = elementCreator("div", "registration-modal-window")

const loginModalWindow = elementCreator("div", "login-modal-window")

authWindow.append(goToRegistrationButton, goToLoginButton)

const redirectToLoginScreen = () => {
}

const registrationForm = new AuthForm("registration")
const loginForm = new AuthForm("login")

registrationForm.usernameInput.addEventListener("input", () => registrationForm.validateUserInputs())
registrationForm.passwordInput.addEventListener("input", () => registrationForm.validateUserInputs())

registrationForm.form.addEventListener("submit", (e) => registrationForm.sendUserInfo(e))

loginForm.usernameInput.addEventListener("input", () => loginForm.validateUserInputs())
loginForm.passwordInput.addEventListener("input", () => loginForm.validateUserInputs())

loginForm.form.addEventListener("submit", (e) => loginForm.checkUserInfo(e))

registrationModalWindow.append(registrationForm.getForm())
loginModalWindow.append(loginForm.getForm())

document.body.append(authWindow, registrationModalWindow, loginModalWindow)
registrationForm.validateUserInputs()
loginForm.validateUserInputs()