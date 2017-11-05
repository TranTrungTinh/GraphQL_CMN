const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue , args){
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(resp => resp.data);
            }
        }
    })
});
const UserType = new GraphQLObjectType({
    name: 'User',
    fields:() => ({
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parentValue , args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(resp => resp.data);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'The root query type',
    fields: {
        users: {
            description: 'Get all user',
            type: new GraphQLList(UserType),
            resolve(){
                return axios.get(`http://localhost:3000/users`)
                    .then(resp => resp.data);
            }
        },
        user: {
            description: 'Get user by id',
            type: UserType,
            args: {id: { type: GraphQLString }},
            resolve(parentValue , args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data);
            }
        },
        companies: {
            description: 'Get all company',
            type: new GraphQLList(CompanyType),
            resolve(){
                return axios.get(`http://localhost:3000/companies`)
                .then(resp => resp.data);
            }
        },
        company: {
            description: 'Get company by id',            
            type: CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue , args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(resp => resp.data);
            }
        }
    }
});
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            description: 'add user firstName: String! , age: Int!',
            type: UserType,
            args: {
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue , {firstName , age}) {
                return axios.post(`http://localhost:3000/users`, {firstName , age})
                    .then(resp => resp.data);
            }
        },
        deleteUser: {
            description: 'delete user id: String!',            
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue , { id }) {
                return axios.delete(`http://localhost:3000/users/${id}`)
                    .then(resp => resp.data);
            }
        },
        editUser: {
            description: 'update user id: String!',            
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                firstName: {type: GraphQLString},
                age: {type: GraphQLInt},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue , args){
                return axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(resp => resp.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
});