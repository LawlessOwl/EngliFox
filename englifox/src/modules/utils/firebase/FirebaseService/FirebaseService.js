import { getAuth, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth, database } from "../firebase.js";
import { ref, set, get, update, remove } from "firebase/database";

export class FirebaseService {
    constructor() {
        this.database = database;
    }

    writeUserData(userId, data) {
        const userRef = ref(this.database, "users/" + userId);
        return set(userRef, data);
    }

    readUserData(userId) {
        const userRef = ref(this.database, "users/" + userId);
        return get(userRef).then(snapshot => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return null;
            }
        });
    }

    updateUserData(userId, data) {
        const userRef = ref(this.database, "users/" + userId);
        return update(userRef, data);
    }

    async deleteUserData(userId) {
        const auth = getAuth();
        const user = auth.currentUser;
        const password = prompt("Пожалуйста введите ваш пароль для подтверждения удаления аккаунта:");
        
        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            const userRef = ref(this.database, "users/" + userId);
            await remove(userRef);
            
            await user.delete()

            allert("Аккаунт успешно удален");
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            return false;
        }
    }

    readAllUsers() {
        const usersRef = ref(this.database, "users/");
        return get(usersRef).then(snapshot => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return null;
            }
        });
    }

    getUserId() {
        const auth = getAuth();
        return new Promise((resolve) => {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    resolve(user.uid)
                } else {
                    resolve(null)
                }
            })
        })
    }

    resetUserProgress(userId) {
        const userRef = ref(this.database, "users/" + userId);
        return update(userRef, {
            completedTasks: {},
            completedThemes: {},
            points: 0
        })
    }

    getAuth() {
        return auth;
    }
}

export const firebaseService = new FirebaseService();