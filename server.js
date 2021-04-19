const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

app.get('/', (req, res) => {
  res.send('<h1>Server up and running</h1>');
});

const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log('Server running on PORT ' + PORT));
