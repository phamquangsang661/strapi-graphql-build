

import { utilsTS } from '../../utilsTS'
import outMessage from '../helpers/outMessage'
import { outMessageInterface } from '../interface/outMessageInterface'



type modalField = {
    key: string,
    type: string,
    defaultValue?: string
}
type modalFieldDescription = {
    key: string,
    description: string
}
type modalType = 'input' | 'type' | 'enum'

type modalConstruct = {
    modalName: string | null, modalType: modalType, modalDescription?: string
}
class modal extends outMessage {
    private type: modalType = 'type'
    private modalFields: Array<modalField> = []
    private modalName: string = "default"
    private modalDescription: string = "No description"
    private hasDescription: boolean = false
    private modalFieldDescriptions: Array<modalFieldDescription> = []


    constructor(ctx: modalConstruct) {
        super()
        if (ctx.modalName) {
            this.modalName = ctx.modalName
            this.type = ctx.modalType
            if (ctx.modalDescription) {
                this.modalDescription = ctx.modalDescription
                this.hasDescription = true
            }
        }
        return this
    }
    get ModalName(): string {
        return this.modalName
    }


    addFieldBySchema(classSchemas, description: { [key: string]: string } = {}) {
        try {
            this.hasError()
            var keyOfModal = utilsTS.common.getArrayFieldOfClass(classSchemas)
            var tmpInstance = new classSchemas()
            for (var key in keyOfModal) {
                const proName = keyOfModal[key]
                let tmp = tmpInstance[proName]
                this.modalFields.push({
                    key: proName as string,
                    type: typeof tmp
                })
                if (proName as string in description) {
                    this.modalFieldDescriptions.push({
                        key: proName as string,
                        description: description[proName as string]
                    })
                }
            }
        } catch (err) {
            this.addError(err)
        }
        finally {
            return this
        }
    }
    addField(modal: modalField, description?: string): modal {
        try {
            this.hasError()
            this.modalFields.push(modal)
            if (description) {
                this.modalFieldDescriptions.push({
                    key: modal.key,
                    description
                })
            }
        } catch (err) {
            this.addError(err)
        }
        finally {
            return this
        }
    }
    require(): modal {
        try {
            this.hasError()
            this.modalFields[this.modalFields.length - 1].type += "!";
        } catch (err) {
            this.addError(err)
        }
        finally {
            return this
        }
    }
    hasDescriptions(): boolean {
        return this.hasDescription
    }
    getModalQuery(): outMessageInterface.onSignal {
        try {
            let buildQuery: string = this.type
            buildQuery += " " + this.modalName + " "
            buildQuery += " {\n"
            for (let key in this.modalFields) {
                let modalField = this.modalFields[key]
                buildQuery += modalField.key
                if (this.type == 'enum') {
                    buildQuery += '\n'
                } else {
                    buildQuery += " : " + utilsTS.common.convertFieldToGraph(modalField.type)
                    buildQuery += modalField.defaultValue ? ' = ' + modalField.defaultValue : "" + '\n'
                }
            }
            buildQuery += "}\n"

            return this.onSuccess(buildQuery)
        }
        catch (err) {
            this.addError(err)
            return this.onFailure()
        }
    }
    getModalDescription(): outMessageInterface.onSignal {
        try {
            let description = {
                _description: this.modalDescription
            }
            for (var key in this.modalFieldDescriptions) {
                let mfd = this.modalFieldDescriptions[key]
                description[mfd.key] = mfd.description
            }
            return this.onSuccess(description)
        }
        catch (err) {
            this.addError(err)
            return this.onFailure()
        }
    }
}

export default modal 