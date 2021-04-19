const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');
const axios = require('axios');
// Hardcoded Data

// const customer = [
//   { id: '1', name: 'John Doe', email: 'johndoe@gmail.com', age: 35 },
//   { id: '2', name: 'Steve Smith', email: 'steve@gmail.com', age: 25 },
//   { id: '3', name: 'Sara Williams', email: 'sara@gmail.com', age: 12 }
// ];

// Customer Type

const CustomerType = new GraphQLObjectType({
  name: 'CustomerType',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

// Root Query

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getCustomerById: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: (parentValue, args) => {
        return axios
          .get('http://localhost:3000/customers/' + args.id)
          .then((res) => res.data);
        // for (i = 0; i < customer.length; i++) {
        //   if (customer[i].id === args.id) {
        //     return customer[i];
        //   }
        // }
        // customer.filter((user) => {
        //   if (user.id === args.id) {
        //     return user;
        //   }
        // });
      }
    },
    getAllCustomers: {
      type: new GraphQLList(CustomerType),
      resolve: async (parent, args) => {
        const res = await axios.get('http://localhost:3000/customers');
        return res.data;
      }
    }
  }
});

// Mutations

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parentValue, args) => {
        return axios
          .post('http://localhost:3000/customers', {
            name: args.name,
            email: args.email,
            age: args.age
          })
          .then((res) => res.data);
      }
    },
    removeCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parentValue, args) => {
        return axios
          .delete('http://localhost:3000/customers/' + args.id)
          .then((res) => res.data);
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve: (parent, args) => {
        return axios
          .patch('http://localhost:3000/customers/' + args.id, args)
          .then((res) => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
