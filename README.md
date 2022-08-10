# Fitness-Tracker-API
an API for our new fitness empire using node, express, and postgresql

## How to access the list of routines and activities
By visiting: https://afternoon-meadow-94955.herokuapp.com/api/routines

Your browser will look like this: 
![fitnesstracker-routines](https://user-images.githubusercontent.com/62524957/184006774-b94acb0b-e24f-42ea-b2ab-9b9e17a07931.png)

By visiting https://afternoon-meadow-94955.herokuapp.com/api/activities

Your browser will look like this: 
![fitnesstracker-activities](https://user-images.githubusercontent.com/62524957/184007178-ecc6c720-6717-495e-ae33-408cc700329c.png)

## Other features of Fitness Tracker
There are many more routes that are built out for the API such as ones handling user register/login, updating activities/routines, deleting activities/routines, fetching activities/routines by their name or ID, and many many more. 






## Getting Started
Install Packages

    npm i

Initialize Database

    createdb fitness-dev
    
Run Seed Script
    
    npm run seed:dev

## Automated Tests


To run all the tests in watch mode (re-runs on code update), run

    npm run test:watch

### DB Methods


    npm run test:watch db

### API Routes (server must be running for these to pass)

    npm run test:watch api
