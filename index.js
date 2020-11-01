const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { graphql, buildSchema } = require('graphql');
//스키마 생성(데이터 타입, 엔드포인트등 정의)
//must be "Query", not any other word
const schema = buildSchema(`
  type Query {
    getHello: Int
    getPost: Post
  }
  type Post {
      id: Int
      title: String
  }
`);

//Resolver(MVC패턴의 Controller 비슷)
const root = { 
    getHello: () => 5, 
    getPost: () => ({
        id: 1,
        title:"hello world"
    })
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);

app.listen(4000);