[![Netlify Status](https://api.netlify.com/api/v1/badges/f445d908-f1f4-4473-ad57-151f804e81fa/deploy-status)](https://app.netlify.com/sites/blissful-mahavira-99db1a/deploys)

## What is it

Basically, it´s a system that lets a group of people speak in turns. If you want to speak, you raise your hand and wait for your turn in a queue.

This feature is present in apps like google meet and zoom.

This app also adds some other features, like sending feedback to speakers, collaborative notes (that people running late could use to catch up), timers, and reactions (likes/dislikes).

## Technologies

- [Croquet sdk](!https://croquet.io/sdk/docs/)
- vanilla html & css
- Parcel (transpiles code and generates a bundle)

## Demo

Try it: https://blissful-mahavira-99db1a.netlify.app/

![Demo](https://github.com/libasoles/croquet-enqueue-app/blob/main/demo.gif)

### Desktop

![Desktop demo](https://github.com/libasoles/croquet-enqueue-app/blob/main/desktopSnapshot.png)

## How to run

`yarn start`

And then open: http://localhost:1234/

## About the code

- each view should start _hydrating_ it's state. That is, reflection the model state visually.
- `viewId` represents a user, but the same user could open a new broser tab an have a second identity.
