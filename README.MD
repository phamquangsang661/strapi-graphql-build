# strapi-graphql-build
## Fast graphql builder
---
Make strapi graphql be easy and readable
If you want to add features or report bugs, you can make a push request
## Install
---
```sh
npm install strapi-graphql-build
```
## How to use?
---
Example
- Create schema.graphql.js in folder "config" of api
```
let modalCreateOrder = new gplInstance
    .modalBuilder({ modalName: 'createOrderOptions', modalType: 'input', modalDescription: 'create order' })
    .addField({ key: 'id', type: 'int' }, 'Identity of order')
    .addField({ key: 'something1', type: 'string' }, 'something')
    .addField({ key: 'something1', type: 'string' }, 'something').require() //If the field is required
    .addField({ key: 'something1', type: 'string' }, 'something')
    
let modalInputCustomerCreateOrderCombo = new gplInstance
    .modalBuilder({ modalName: 'inputCustomerCreateOrderCombo', modalType: 'input', modalDescription: 'create orrder combo' })
    .addField({ key: 'products', type: '[productInCart]!' }, 'list of product') // u should define modal productInCart and push it in modals array below
     .addField({ key: 'something1', type: 'string' }, 'something')
      .addField({ key: 'something1', type: 'string' }, 'something')

let modals = [
    modalCreateOrder,
    modalInputCustomerCreateOrderCombo
]
//all function in below is example , you can try other test
let resolverInstance = new gplInstance
    .resolverBuilder(modals)
    .addQuery('Query', 'getOrderOfCustomer', 'pagingOrder', [
        { key: 'page', type: 'int' },
        { key: 'per_page', type: 'int' },
        { key: 'sort', type: 'sortOrder' }
    ], {
        policies: ['global::user-iam', 'global::customer-iam'],
        resolver: 'application::up_order.up_order.getOrderOfCustomer'
    })
    .addQuery('Mutation', 'customerCreateOrder', 'outMutation', [
        { key: 'input', type: 'inputCustomerCreateOrder!' }
    ], {
        policies: ['global::user-iam'],
        resolver: 'application::up_order.up_order.customerCreateOrder'
    })
    .addQuery('Mutation', 'customerCreateOrderCombo', 'outMutation', [
        { key: 'input', type: 'inputCustomerCreateOrderCombo!' }
    ], {
        policies: ['global::user-iam', 'global::customer-iam'],
        resolver: 'application::up_order.up_order.customerCreateOrderCombo'
    })
    .addQuery('Mutation', 'createOrder', 'outMutation', [
        { key: 'input', type: 'inputCreateOrder!' }
    ], {
        policies: ['global::user-iam'],
        resolver: 'application::up_order.up_order.createOrder'
    })
let instance = resolverInstance.buildSchema()
export default instance.content
```

