# project structure

create src folder and index.js file inside of src folder

# type module

for importing modules inside another file
add type in package.json, which will solve the following error
Error:=>
Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.

# Error module not found

extension of moudle is compulsory in ESM(Ecmma Script Module), so add .js at the end of module name

# adding fastify and fastify-static

Fastify is a web server framework for Node.js that is an alternative to Express.

Benefits include:

one of the fastest Node-based web servers
supports JSON Schema for validating requests
uses Pino for logging
maintains a TypeScript type declaration file so usage can be type checked
provides a good developer experience
To install Fastify in a project, enter npm install fastify.

To enable serving static files, enter npm install fastify-static.

# adding nodemon to watch changes and reload server

# fastify fastify static

fastify.register(require('@fastify/static'), {
root: path.join(\_\_dirname, 'public'),
prefix: '/public/', // optional: default '/'
})

# dot env

environment variable in node
dotenv package
find and use .env file
create a dotenv.js and add the following
import dotenv from "dotenv";
dotenv.config(); => search and include .env file variables

# mongodb database node-tutorial

username:hari
password: ysmvUWxtm34RsWif

mongodb+srv://hari:<ysmvUWxtm34RsWif>@cluster0.pyfmrvd.mongodb.net/?retryWrites=true&w=majority

# add mongodb

npm install --save mongodb

connecting to cloud mongo
import mongo from "mongodb"
const {MongoClient}= mongo
const url= process.env.MONGO_URL

# create connection client

export const client= new MongoClient(url, {useNewUrlParser:true})

#create connectDb function
export async function connectDb(){
try{
await client.connect()

        #test connection with ping
        await client.db("admin").command({ping:1})

        console.log("Connectioin Successful")
    }catch (e){
        console.erro(e)

        #close connection
        await client.close
    }

}

# initiate connection in index.js

import {connectDb} from "db.js"

# start connection then start app

connectDb().then(()=>{
startApp();
})

# Encryption

transforming a plain text using key example changing each letter of password => to next letter => qbttxpse , encryption key is +1

# Hashing

A one way trip, Not mean to be reversed,
password x hash function => hashed data (cannot be converted back to password)
md4, md5, sha are security hashing algorithm

sha-256

# Salting

adds additional data (known as salt)
password => password+ salt => (password+ salt) x hash function
=> creates a unique hash

# Registration

=> generate salt
import bcrypt from 'bcryptjs'
const {genSalt, hash}= bcrypt
=> hash with salt
=> store in database
=> return user from database

# using bcryptjs and register user hashing password

//create salt
const salt = await genSalt(10);
// hash with salt
const hashedPassword = await hash(password, salt);

// store in mongo database
const result = await user.insertOne({
email: {
address: email,
verified: false,
},
password: hashedPassword,
});

# Authentication and Authorization

# Authentication

=> get email and password
=> check email on user table
=> compare password with hashed password

#Cookie and JWT, JSON Web Token

=> JWT, JSON Web Token,  
is used to store information as accessToken or refresh Token, as cookie cant save object, so jwt is a long string that contains object, which can be decoded into a object

# Difference between accessToken and refreshToken

session => A session is a group of user interactions with your website that take place within a given time frame. For example a single session can contain multiple page views, events, social interactions, and ecommerce transactions

acessToken =>

- JWT, contains all the information someone needs to loging
- says this user has access
- Only available for current session

refreshToken =>

- JWT, only containes session id, browsers checks if session is valid
- If valid, be used to generate new access token,
- Used to refresh the access token

# Getting and Setting Cookie

create secret in env
use password generator or something random string
=> dependecies
npm install --save @fastify/cookie, jsonwebtoken

# create cookie

- import cookie from '@fastify/cookie'
- register cookie to app
  app.regiseter(cookie, {
  secret:process.env.COOKIE_SIGNATURE
  } )
- set Cookie
  in authorisation route( /api/authorize)
  response.setCookie("cookie_name", "cookie_Value", {
  //cookie options
  path:"/",
  domain:"localhost",
  httpOnly:true,
  }).send({ // send cookie as response along with data
  data:"data"
  })

# Sessions

-> create folder and file sessions.js, where sessison data is stored in database, so its a model for session
-> create session handler in accounts

- retrieve connection information
  const connectionInformation = {
  ip: request.ip,
  userAgent: request.headers["user-agent"],
  };
- Generate a session token
  const sessionToken= createSession(userId, connectioinInformation)

- database insert for session
- Generate a session token
  const createSession(userId, connection){
  const sessionToken = randomBytes(43).toString("hex");
- retrieve connection information
  const { ip, userAgent } = connection;
- database insert for session
  const { session } = await import("../sessions/sessions.js");

      const result = await session.insertOne({
        sessionToken,
        userId,
        valid: true,
        userAgent,
        ip,
        updatedAt: new Date(),
        createdAt: new Date(),
      });

- return session token
  return sessionToken;
  }

# Get User from Cookies

- steps
  - Get access and refresh tokens
  - if access token
  - decode acces token
  - return user from record
  - decode refresh token
  - look up session
  - confirm session is valid
  - refresh toekns
  - return current user

# Log out

- export async function logUserOut(request, response) {
  - Get refresh token
  - look up session in session table from database
  - Decode SessionToken from refreshToken
  - Delete database record for session
  - remove cookies
