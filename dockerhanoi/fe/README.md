![CodeShip](https://codeship.com/projects/3ec06f20-3b54-0133-afc9-4e85fe1543ec/status?branch=demo)
## Features
- Login Page
- Register Page
- Dockerize a application 
- Deploy App to AWS
- Supports multiple languages
- Supports Send Email in Queue

## Installation
To run this application, you have to have NODEJS (recommended node 0.10.37), NPM, REDIS, SQLITE3, GIT, GRUNT, BOWER.
  - Run `bower install`
  - Run `npm install`

## Configuration
Before running the application, you have to create config file to match with your enviroment. I create two sample config files. One for client, the other one for server.
```
cp config/client-default.js config/client-dev.js
cp config/default.js config/dev.js
```

## Run
  - Run `NODE_ENV=dev npm start`
  - Run `grunt test` to make sure the application work perfectly

## Demo
[Dockerize your Application](http://ec2-52-74-0-120.ap-southeast-1.compute.amazonaws.com)

The scenario for demo:
- Login (register an account firstly)
- Connect your account to Github
- Create Dockerfile, Docker Compose for your source code
- Add AWS account for deployment
- Run build & view logs


## License MIT
Copyright (c) 2015
