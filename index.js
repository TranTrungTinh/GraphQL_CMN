// inport library
const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

// create
const app = express();

// middleware
app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

app.listen(4000, () => console.log('Server has been started!'));