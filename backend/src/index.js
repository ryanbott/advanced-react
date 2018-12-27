// let's go!
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());
//todo use express middlewaer to populate current user

//decode jwt to get user id for each req
server.express.use((req, res, next) => {
  const {token} = req.cookies;
  console.log("this is the token: " + token);
  if(token) {
    const {userId} = jwt.verify(token, process.env.APP_SECRET);
    console.log("user id is: " + userId);
    //put user id onto request
    req.userId = userId;
  }
  next();
});


server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  }, deets => {
    console.log(`YAYY! Server is Running on http://localhost:${deets.port}`);
  }
);
