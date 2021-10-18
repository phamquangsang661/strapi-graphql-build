export default (fieldType: string): string => {
    const FIELD_CASE = {
        "string": "String",
        "string!": "String!",
        "int": "Int",
        "int!": "Int!",
        "float": "Float",
        "float!": "Float!",
        "bool": "Boolean",
        "bool!": "Boolean!",
        "id!": "ID!",
        "id": "ID",
        "number": "Float",
        "[string]": "[String]"
    }
    if (fieldType in FIELD_CASE)
        return FIELD_CASE[fieldType]
    else
        return fieldType
}