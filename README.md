# Community Twitch Development

A web app that helps Twitch streamers and viewers collaborate on a development project.

A Twitch streamer can create categories and add tasks to them. Users can claim a task to show others that they are working on it, and submit a link when they are done. The streamer can also create a private Gitlab group, and allow stream subscribers to gain access.

React and Redux are used to build the frontend. The app runs on a Node server using MongoDB, Passport.js, Redis, and socket.io.

View the demo [here](https://community-twitch-development.herokuapp.com/). (The "change user role" dropdown is for demo purposes only)

--
# Installation

Clone the repository, and install depedencies with npm.

~~~sh
npm install
~~~

--
# Set Up

1. Rename `.env.example` to `.env`. This contains all environment variables needed to configure the app.
2. Register applications on [Twitch.tv](www.twitch.tv) and [Gitlab](www.gitlab.com) to obtain their respected client id and secret.
3. Provide links to MonogoDB and Redis. The easiest way to get up and running is to create a Node application on [Heroku](www.heroku.com). You can then set up free mlab and Heroku Redis plans.
4. Save an image for the navigation bar in `/public/img`, and specify the path in the environment variable. The suggested image size is 90 x 30.

--
# Build

Once the `.env` is filled out, you are ready to build the app.

~~~sh
npm run prod-build
~~~

You can now deploy the app on Heroku and add the environment variables to their configuration.
