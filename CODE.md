# Code Nuances
- [Code Nuances](#code-nuances)
  - [Package Scripts](#package-scripts)
  - [DB Config](#db-config)
      - [setupDB](#setupdb)
      - [DB Class](#db-class)
      - [Crud Class](#crud-class)
    - [Params](#params)
  - [Testing](#testing)
    - [Test Coverage Threshold](#test-coverage-threshold)
    - [Requires MongoDB Connection](#requires-mongodb-connection)
    - [Leverage NPM Test Scripts](#leverage-npm-test-scripts)

## Package Scripts
- `stat:auth-db` is an example of connecting to an authenticated `localhost` instance of mongodb
- `start:docker-dev` is an example of connecting to an authenticated containerized instance of the db. This is used in the `dev.docker-compose` file and references the mongo host as the container (_service_) name `mongobox`
- `start-local` is an example of connecting to an unauthenticated instance of the db. This can be used for local development and other instances where authentication, itself, may not be required

## DB Config
Currently a few functions and classes can be used to work with a db: 
- [setupDB](#setupdb)
- [new DB()](#db-class)
- [new Crud()](#crud-class)
#### setupDB
This is an async fn that uses the `DB` class and connects to a mongo client.  
The code for this lives in `server/server-setup/setup-fns.js`.  

#### DB Class
This is a class that returns an "instance" of a db connection, and includes a few methods: `connect`, `close`, `getAndLogsDBs`, and `registerDB`.  
The code for this lives in `server/models/db/index.js`.  

#### Crud Class
This is a class that returns an instance of a "crud"-like "model".  
This is an extension of the `DB` class.  
This requires...
- a mongoDB instance (_can be setup with_)
- a collection name to use


### Params
Some env vars can be setup for connecting to an authenticated db instance. These can be set through the cli used to start the server. These are accessed through `process.env.<param>`:



## Testing
### Test Coverage Threshold
The code coverage at time of writing is at & above 95%. It'd be nice to keep it that way :) 
### Requires MongoDB Connection
Testing the api requires a connection to a mongo database on `localhost:27017`. Assure a mongo instance is up, running, and available through `localhost:27017`.  
One way to setup a mongo instance could be to use docker with:  
`docker run -p 27017:27017 --rm mongo:5.0.2`.  
### Leverage NPM Test Scripts
With a mongo instance available, leverage a few npm scripts:  
- **`npm run test`**: runs the tests
- **`npm run test:coverage`**: runs the tests and prints a code-coverage result in the terminal (_configured with [jest](https://jestjs.io/) and jest's [code coverage threshold config](https://jestjs.io/docs/configuration#coveragethreshold-object)_)


