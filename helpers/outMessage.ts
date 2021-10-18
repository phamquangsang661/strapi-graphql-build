import { outMessageInterface } from '../interface/outMessageInterface'




class outMessage {
    isValid: boolean = true
    messages: string[] = []
    constructor() {

    }
    hasError(): boolean {
        if (this.messages.length > 0)
            throw "";
        else
            return false
    }
    getMessages() {
        return this.messages
    }
    getMessage() {
        let messageTemp = ""
        let messageInc = this.messages[0]
        while (messageTemp == "") {
            if (Array.isArray(messageInc)) {
                messageInc = messageInc[0]
            } else {
                messageTemp = messageInc
            }
        }
        return messageTemp
    }
    addError(err: any): void {
        if (err != "") {
            if (Array.isArray(err))
                this.messages = this.messages.concat(err)
            else if (typeof err == "string")
                this.messages.push(err)
            else if (err.message)
                this.messages.push(err.message)
            else if (typeof err != undefined)
                this.messages.push(err)
        }
        return
    }
    onSuccess(content: any): outMessageInterface.onSignal {
        return {
            isValid: true,
            content
        }
    }

    onFailure(): outMessageInterface.onSignal {
        return {
            isValid: false,
            message: this.messages
        }
    }


}
export default outMessage