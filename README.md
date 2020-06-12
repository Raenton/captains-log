# Captain's Log

Please excuse the silly name, I was thinking of pirates when I started this.

This project aims to act as a blog platform similar to Medium. Multiple-user able,
Users can sign up, create posts, like, view and comment on the posts of other users.

Built with GraphQL and Prisma v1.0.

## Prerequisites

You will need to have Docker, yarn, and NodeJS installed on your system.

## How to use

From root directory, run the following:

```
yarn install          # install dependencies
docker-compose up     # deploy MySQL database with seed schema
prisma generate       # generate the prisma-client
yarn dev              # run the development server with nodemon
```
You can now navigate to `http://localhost:3000` to use the GraphQL Playground (supplied by `graphql-yoga`).


If you wish to rebuild the Prisma Schema, run:
```
prisma introspect
prisma generate
```
This will result in prisma generating a `/prisma/schema.prisma` from the MySQL tables.
A fresh prisma client (used in the application JS) will then be built.