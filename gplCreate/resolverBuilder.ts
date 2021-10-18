
import modalBuilder from './modalBuilder'
import { utilsTS } from '../utilsTS'
import { outMessageInterface } from '../interface/outMessageInterface'
import _lengthOfObject from '../utilsTS/common/_lengthOfObject'
import outMessage from '../helpers/outMessage'

type resolverFunction = (obj: any, args: any, options: any) => any
type resolverType = 'Mutation' | 'Query'
type resolveParam = {
    description?: string,
    policies?: Array<string>,
    resolver: string | resolverFunction,
    resolverOf?: string
}

interface schemaGraph {
    definition: string,
    query?: string,
    mutation?: string,
    type: {
        [key: string]: {
            _description: string,
            [key: string]: string
        }
    }
    resolver: {
        Query: {
            [key: string]: resolveParam
        },
        Mutation: {
            [key: string]: resolveParam
        }
    }
}



class resolverBuilder extends outMessage {
    private resolverQuery: {
        resolverDeclare: string,
        resolver: { [key: string]: resolveParam }
    } = { resolverDeclare: "", resolver: {} }
    private resolverMutation: {
        resolverDeclare: string,
        resolver: { [key: string]: resolveParam }
    } = { resolverDeclare: "", resolver: {} }
    private modalBuilderQuery: string = ""
    private schemas: schemaGraph = {
        definition: "",
        type: {},
        resolver: {
            Query: {},
            Mutation: {}
        }
    }
    constructor(modalBuilder: Array<modalBuilder>) {
        super()
        try {
            for (let key in modalBuilder) {
                let getModalBuilder = modalBuilder[key].getModalQuery()

                if (getModalBuilder.isValid) {
                    this.modalBuilderQuery += getModalBuilder.content
                } else {
                    throw getModalBuilder.message as string///?? check later
                }
                if (modalBuilder[key].hasDescriptions()) {
                    this.schemas.type[modalBuilder[key].ModalName] = modalBuilder[key].getModalDescription().content
                }
            }

        }
        catch (err) {
            this.addError(err)
        }
        finally {
            return this
        }
    }
    addQuery(queryType: resolverType, queryName: string, queryOutput: string, queryParam: { key: string, type: string }[], resolveParam: resolveParam): resolverBuilder {
        try {

            this['resolver' + queryType].resolverDeclare += queryName + (queryParam.length != 0 ? "(" : "")
            for (let key in queryParam) {
                this['resolver' + queryType].resolverDeclare += (String(key) === "0") ? "" : ","
                this['resolver' + queryType].resolverDeclare += queryParam[key].key + ":"
                this['resolver' + queryType].resolverDeclare += utilsTS.common.convertFieldToGraph(queryParam[key].type)
            }
            this['resolver' + queryType].resolverDeclare += (queryParam.length != 0 ? "): " : ": ")
            this['resolver' + queryType].resolverDeclare += queryOutput + '\n'
            let query: resolveParam = {
                resolver: resolveParam.resolver
            }
            if (resolveParam['policies']) {
                query.policies = resolveParam['policies']
            }
            if (resolveParam['description']) {
                query.description = resolveParam['description']
            }

            if (resolveParam['resolverOf']) {
                query.resolverOf = resolveParam['resolverOf']
            }

            this['resolver' + queryType].resolver[queryName] = query
        } catch (err) {
            this.addError(err)
        }
        finally {
            return this
        }
    }



    buildSchema(): outMessageInterface.onSignal {
        try {
            this.schemas.definition = this.modalBuilderQuery

            utilsTS.common.lengthOfObject(this.resolverQuery.resolver) != 0 ? (() => {
                this.schemas.query = this.resolverQuery.resolverDeclare
                this.schemas.resolver.Query = this.resolverQuery.resolver
            })() : true

            utilsTS.common.lengthOfObject(this.resolverMutation.resolver) != 0 ? (() => {
                this.schemas.mutation = this.resolverMutation.resolverDeclare
                this.schemas.resolver.Mutation = this.resolverMutation.resolver
            })() : true
            return this.onSuccess(this.schemas)
        }
        catch (err) {
            this.addError(err)
            return this.onFailure()
        }
    }
}

export default resolverBuilder 