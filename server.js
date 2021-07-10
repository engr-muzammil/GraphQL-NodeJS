const express = require('express')
const cors = require('cors')
const expressGraphQL = require('express-graphql')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const app = express()
app.use(cors())
const categories = [
  { _Cid: "5fdfa73ef3c3d19a0aecd43a", name: "food & beverages" },
  { _Cid:"5fe1a4e3c0060b002f164b5d", name:"household items"}
]
const products = [
    {
      Quantity: "1",
barcode: "123ABC",
discountPercentage: 0,
name: "surf excel new",
saleFinalPrice: 55,
salePrice: 50,
taxPercentage: 10,
unitQuantity: "1",
unitSaleFinalPrice: 55,
unitSalePrice: 50,
unitType: "gm",
units: "250",
_id: "5ff6e129b7b652002f111d3e",
_Cid: "5fdfa73ef3c3d19a0aecd43a"
    },
    {
      Quantity: "1",
barcode: "123ABC",
discountPercentage: 0,
name: "surf excel Shampoo",
saleFinalPrice: 55,
salePrice: 50,
taxPercentage: 10,
unitQuantity: "1",
unitSaleFinalPrice: 55,
unitSalePrice: 50,
unitType: "gm",
units: "250",
_id: "5ff6e855b7b652002f111d3f",
_Cid: "5fe1a4e3c0060b002f164b5d"
    }
]

const ProductType = new GraphQLObjectType({
  name:'Product',
  description: 'This represenets a product along with its category',
  fields: () => ({
    Quantity: { type: GraphQLNonNull(GraphQLString) },
barcode: { type: GraphQLNonNull(GraphQLString) },
discountPercentage:  { type: GraphQLNonNull(GraphQLInt) },
name:{ type: GraphQLNonNull(GraphQLString) },
saleFinalPrice:  { type: GraphQLNonNull(GraphQLInt) },
salePrice:  { type: GraphQLNonNull(GraphQLInt) },
taxPercentage:  { type: GraphQLNonNull(GraphQLInt) },
unitQuantity: { type: GraphQLNonNull(GraphQLString) },
unitSaleFinalPrice:  { type: GraphQLNonNull(GraphQLInt) },
unitSalePrice:  { type: GraphQLNonNull(GraphQLInt) },
unitType: { type: GraphQLNonNull(GraphQLString) },
units: { type: GraphQLNonNull(GraphQLString) },
_id: { type: GraphQLNonNull(GraphQLString) },
_Cid: { type: GraphQLNonNull(GraphQLString) },
      category: {
        type: CategoryType,
        resolve: (product) => {
          return categories.find(category => category._Cid === product._Cid)
        }
      }
  })
})
const CategoryType = new GraphQLObjectType({
  name: 'Category',
  description: 'This represents a Category of a product',
  fields: () => ({
    _Cid: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    products: {
      type: new GraphQLList(ProductType),
      resolve: (category) => {
        return products.filter(product => product._Cid === category._Cid)
      }
    }
  })
})
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    product: {
      type: ProductType,
      description: 'A Single Product',
      args: {
        productID: { type: GraphQLInt }
      },
      resolve: (parent, args) => products.find(product => product._id === args._id)
    },
    products: {
      type: new GraphQLList(ProductType),
      description: 'List of All Product',
      resolve: () => products
    },
    categories: {
      type: new GraphQLList(CategoryType),
      description: 'List of All Categories',
      resolve: () => categories
    },
    category: {
      type: CategoryType,
      description: 'A Single Category',
      args: {
        categoryID: { type: GraphQLInt }
      },
      resolve: (parent, args) => categories.find(category => category._Cid === args._Cid)
    }
  })
})

// const RootMutationType = new GraphQLObjectType({
//   name: 'Mutation',
//   description: 'Root Mutation',
//   fields: () => ({
//     addProduct: {
//       type: BookType,
//       description: 'Add a Product',
//       args: {
//         name: { type: GraphQLNonNull(GraphQLString) },
//         categoryID: { type: GraphQLNonNull(GraphQLInt) }
//       },
//       resolve: (parent, args) => {
//         const product = { id: products.length + 1, name: args.name, categoryID: args.categoryID }
//         products.push(product)
//         return product
//       }
//     },
//     addCatgory: {
//       type: CategoryType,
//       description: 'Add a Category',
//       args: {
//         categoryName: { type: GraphQLNonNull(GraphQLString) }
//       },
//       resolve: (parent, args) => {
//         const category = { id: categories.length + 1, name: args.name }
//         categories.push(category)
//         return category
//       }
//     }
//   })
// })

const schema = new GraphQLSchema({
  query: RootQueryType
})

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}))
app.listen(5000, () => console.log('Server Running'))
