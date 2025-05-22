
const voiceLoader = () => {
    return new Promise((resolve, reject) => {
        if (window.responsiveVoice) {
            resolve(window.responsiveVoice);
            return;
        }
    })
}

const voicesLanguage = {
    "en-US": "UK English Female",
    "en-GB": "UK English Male",
    "ru-RU": "Russian Female"
}

export const textToSpeak = async (text, lang = "en-US") => {
    try {
        const responsiveVoice = await voiceLoader();

        const speakerVoice = voicesLanguage[lang] || "UK English Female";

        responsiveVoice.cancel();

        responsiveVoice.speak(text, speakerVoice, {
            pitch: 1,
            rate: 1,
            volume: 1,
            onstart: () => {
                console.log("Started speaking");
            },
            onend: () => {
                console.log("Ended speaking");
            },
            onerror: (error) => {
                console.error("Error speaking:", error);
            }
        });
    } catch (error) {
        console.error("Failed to use ResponsiveVoice:", error);

        fallbackSpeach(text, lang)
    }
}

const fallbackSpeach = (text, lang = "en-US") => {
    try {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        utterance.onstart = () => {
            console.log("Started speaking with fallback");
        }

        utterance.onend = () => {
            console.log("Ended speaking with fallback");
        }

        utterance.onerror = (error) => {
            console.error("Error speaking with fallback:", error);
        }

        speechSynthesis.speak(utterance);
    } catch (error) {
        console.error("Failed to use fallback speech:", error);
    }
}

export const getAvailableVoices = async () => {
    try {
        const responsiveVoice = await voiceLoader();
        return responsiveVoice.getVoices();
    } catch (error) {
        console.error("Failed to get available voices:", error);
        return [];
    }
}
