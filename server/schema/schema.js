const Project = require('../models/Project')
const Client = require('../models/Client')

const { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLEnumType,GraphQLList, GraphQLNonNull } = require('graphql')

//client type

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})

//project type

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client:{
            type:ClientType,
            resolve(parent,args){
                return Client.findById(parent.clientId)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        projects:{
            type:new GraphQLList(ProjectType), //its a list bcz we need all clients
            resolve(parent,args){
                return Project.find();
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //use mongo query here to find the data in the db according to id given above
                //but for now using sample data so using diff find method
                return Project.findById(args.id)
            }
        },
        clients:{
            type:new GraphQLList(ClientType), //its a list bcz we need all clients
            resolve(parent,args){
                return Client.find()
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //use mongo query here to find the data in the db according to id given above
                //but for now using sample data so using diff find method
                return Client.findById(args.id)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addClient:{
            type:ClientType,
            args:{
                name: { type: GraphQLString},
                email: { type: GraphQLString },
                phone: { type: GraphQLString }
            },
            resolve(parent,args){
                const client = new Client({
                    name:args.name,
                    email:args.email,
                    phone:args.phone
                })
                return client.save()
            }
        },
        deleteClient:{
            type:ClientType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
                return Client.findByIdAndDelete(args.id)
            }
        },
        addProject:{
            type:ProjectType,
            args:{
                name: { type: GraphQLString},
                description: { type: GraphQLString },

                status: { type: new GraphQLEnumType({
                    name:'ProjectStatus',
                    values:{
                        'new':{value:'Not Started'},
                        'progress':{value:'In Progress'},
                        'completed':{value:'Completed'}
                    }
                }),
                defaultValue:'Not Started'
            },

                clientId:{ type:GraphQLID}
            },
            resolve(parent,args){
                const project = new Project({
                    name:args.name,
                    description:args.description,
                    status:args.status,
                    clientId:args.clientId
                })
                return project.save()
            }
        },
        deleteProject:{
            type:ProjectType,
            args:{
                id:{type:GraphQLID}
            },
            resolve(parent,args){
                return Project.findByIdAndDelete(args.id)
            }
        },
        updateProject:{
            type:ProjectType,
            args:{
                id:{type:GraphQLID},
                name: { type: GraphQLString},
                description: { type: GraphQLString },
            },
            resolve(parent,args){
                return Project.findByIdAndUpdate(args.id,
                {
                    $set:{
                        name:args.name,
                        description:args.description
                    },
                })
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,   //if name would be query so then dont equal to Root query so with mutation
    mutation
})