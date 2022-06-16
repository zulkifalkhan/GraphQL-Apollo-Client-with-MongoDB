const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 5000;
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const connectDB = require('../server/config/db')
const cors = require('cors')
const app = express()

//connect to database
connectDB()

app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
}))

app.listen(port, console.log(`Running on the port:${port}`))