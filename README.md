# Captain's Log

Please excuse the silly name, I was thinking of pirates when I started this.

This project aims to act as a blog platform similar to Medium. Multiple-user able,
Users can sign up, create posts, like, view and comment on the posts of other users.

Built with GraphQL and Prisma v1.0, (the smooth, configurable interfaces and SDLs that I love).

## Prerequisites

You will need to have yarn and Docker installed.

## How to use

Install dependencies
```
yarn install
```

Run the Prisma Server and connected MySQL Database
```
cd prisma
docker-compose up -d
prisma deploy
```

Run the server (from root)
```
yarn start
```

Run the server in development mode
```
yarn dev
```