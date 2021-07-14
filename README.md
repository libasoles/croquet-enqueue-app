## What is it



## How to run

`yarn start`

And then open: http://localhost:1234/

## About the code

- each view should start _hydrating_ it's state. That is, reflection the model state visually.
- `viewId` represents a user, but the same user could open a new broser tab an have a second identity.

### Conventions
- views send `push` messages, while the models send `update`
