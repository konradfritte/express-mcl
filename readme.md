# Express-MCL

This is a simple express application hosting the Mouselab MDP application on a heroku server

There are two different heroku instances for the two experiment groups:
- standard: https://express-mcl-standard.herokuapp.com/
- offset: https://express-mcl-random.herokuapp.com/

## Starting the app locally

run `npm install` or `yarn` to install dependencies

You can start the app in two different ways:
- using the express server on localhost:3000
- using the local heroku instance on localhost:5000

To start the app on local express server run `npm start` or `yarn start`

To start the app on local heroku server run `heroku local web`

## Access Experiment Data

After each experiment the usage data is posted to the express server

Each experiment data is stored as a JSON in `public/experiment-data` with its timestamp as filename


## Generate new trials

To generate new trials, go to  `tools` and run `node make-trials.js`

The new trials overwrite the old ones in `public/static/json/trials.json`
