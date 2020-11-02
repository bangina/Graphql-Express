const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { graphql, buildSchema } = require('graphql');
//스키마 생성(데이터 타입, 엔드포인트등 정의)
//must be "Query", not any other word
//Int! : ! means required
//post(id)==> 1건 조회
//posts --> List 
//Post에 Comment 필드를 가져와서 추가
const schema = buildSchema(`
  type Query {
    post(id: Int!): Post
    posts: [Post]
    createPost(title:String) : Post
  }
  type Post {
      id: Int
      title: String
      comments: [Comment]
  }
  type Comment{
      text: String
      user: String
  }
`);
let NEXT_ID = 4;
class Post {
    constructor(post){
        Object.assign(this, post);
        this.comments = post.comments || [];
        this.id = NEXT_ID++;
    }
    async comments(){
        return new Promise((resolve)=>{
            setTimeout(() => {
                resolve(
                  [{
                    text:"what is up",
                    user:"Ina"
                }]
                );
            }, 1000);
        })
    }
}
const posts = [
    {
        id:1,
        title: 'GraphQL',
    },
    {
        id:2,
        title: 'GraphQL with Express',
        comments:[
            {
            text:"what is up",
            user:"Ina"
            }
        ]
    },
    {
        id:3,
        title: 'So much funnnn',
        comments:[
            {
            text:"what is up",
            user:"Ina"
            }
        ]
    },
]

//Resolver(MVC패턴의 Controller 비슷)
const root = { 
    // post: ({id}) => {
    //     return posts[id];
    //     }
    post: ({id}) => {
        return new Post(posts.find(post => post.id===id)); 
        },
    posts: ()=> {
        return posts.map(post=> new Post(post)); 
    },
    createPost: ({title})=>{
        const post = new Post({title});
        posts.push(post);
        return post;
    }
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