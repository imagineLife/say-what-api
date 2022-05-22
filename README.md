Here is a developing http server.  
This server will serve data to a client & act as a "middle-man" between the requesting client and some data.    

This API, and this project at large, will intend to follow the [12-Factor App](https://12factor.net/) methodology.

- [Goals](#goals)
  - [DB Dependent](#db-dependent)
    - [Event-Driven DB Config](#event-driven-db-config)
- [User Account APIS](#user-account-apis)
  - [Register Account](#register-account)
  - [Forgot + Reset PW](#forgot--reset-pw)
    - [admin details later](#admin-details-later)
- [CRUD Text](#crud-text)
  - [Store Text](#store-text)
  - [Add Metadata to Text](#add-metadata-to-text)
  - [Logging](#logging)
  - [Optimizing For Production](#optimizing-for-production)
  - [Using With Docker](#using-with-docker)
    - [Dev](#dev)
    - [Dev with an authenticated Mongo Instance](#dev-with-an-authenticated-mongo-instance)
    - [Prod](#prod)
  - [More Code Details](#more-code-details)
- [Automated Workflow Details](#automated-workflow-details)
  - [Testing](#testing)
  - [Versioning](#versioning)
  - [Build + Deployment](#build--deployment)
  - [Team Notification Integration](#team-notification-integration)
# Goals

## DB Dependent
This API will be connected to a db.  
The db connection will be event-driven.
- The api will start without a connected db
- The db connection instantiation will be async
### Event-Driven DB Config
**A few events** will be setup to interact with the db
- an event that triggers an attempt to connect to the db
  - this will be run on api start as well as during re-try attempts when detected db disconnection
- an event that triggers the "knowledge" of the db connection success
  - this will inform the api to "talk to" the database in the normally expected workflow
- an event that triggers the "knowledge" ofa db error (_and/or disconnection_)
  - this will update the api to return errors to the client during unforeseen db down time

# User Account APIS
As a user I can 
- [ ] Create my account with attributes
  - [ ] first name
  - [ ] last name
  - [ ] email address
  - [ ] password
    - pw stored as one-way non-readable hashed vals

## Register Account
- [ ] Go through an account registration workflow
  - [ ] Sign-up (_register email address_)
  - [ ] validate email
  - [ ] save password

## Forgot + Reset PW
- [ ] Forgot password workflow
  - enter email 
  - click submit 
  - check email
  - click a button in the email or get code from email
  - enter code in ui for email validation
  - enter new pw
- [ ] Reset pw
  - enter current pw
  - enter new pw
  - submit
### admin details later
As an client with "admin" type user credentials, I can
- [ ] Get List of user accounts
  - [ ] email address
  - [ ] last login date
  - [ ] user name
  - [ ] date created

# CRUD Text

## Store Text
As a user I will be able to store text-blobs so that I can later view text for analysis:
- [ ] Text blobs
  - [ ] "raw"?
  - [ ] formatted?

## Add Metadata to Text
As a user, I will be able to add "metadata", important attributes, to the text so that I can categorize the text with 
- [ ] Orator
- [ ] Date
- [ ] tags (_perhaps later on due to complexity of tag integration?!_)
- [ ] more...

## Logging
Incorporates a flexible logging solution.  

## Optimizing For Production
The API is setup to be "bundled" for a tiny code footprint.

## Using With Docker
This server can be run a few different ways as a "containerized" service: one way in a more dev-friendly setup and one way in a more prod-like setup. 

### Dev
A dev image can be built & run as a container using the `dev.Dockerfile`. To build this image (_with docker installed & running on your machine_)
- cd into the server dir
- run `docker build -t dev-server -f dev.Dockerfile .`: this will build a dev-friendly image tagged "dev-server"
- run `docker run --rm -p 3000:3000 -v ${PWD}:/server qwer`: this will run the image as a container
This image is dev friendly with these 2 details, specifically:  
- uses [`nodemon`](https://www.npmjs.com/package/nodemon), which includes "hot-reloading" for faster server development

### Dev with an authenticated Mongo Instance
A dev image and a mongo image can both be started with a docker-compose setup.  
One way to run this is to run from the command line `docker-compose -f dev.docker-compose.yml up --build`.  

### Prod

## More Code Details
See [Code Readme](CODE.md) for more details

# Automated Workflow Details
Some automated process goals here will be to:
## Testing
- enforce unit code-coverage test threshold to be met
- enforce linting

## Versioning
- semantically version the api based on
  - github issues
  - commit messages
  - semver practices

## Build + Deployment
- deploy based on criteria
  - merge to "staging"? deploy to a "staging" instance of the api
  - merge to "main" or "master"? (_figure that out_) deploy to prod
- consider docker...
  - bundling into a docker box & 
  - deploying to a registry (_github registry?_)
  - leverage those images in "staging" and "prod" environments
- leverage webpack to minimize the code footprint for the api in staging/prod

## Team Notification Integration
- send messages to a slack channel
  - on prod deploy
  - on merge-to-dev...?
  - on failed pipeline tests