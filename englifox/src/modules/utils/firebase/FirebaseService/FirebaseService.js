import { database } from "../firebase.js";
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

    deleteUserData(userId) {
        const userRef = ref(this.database, "users/" + userId);
        return remove(userRef)
    }
}