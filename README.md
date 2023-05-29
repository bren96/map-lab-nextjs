# map-lab-nextjs

MAP-LAB client and server using NextJS. Built using
[Next.js Liveblocks Starter Kit](https://liveblocks.io/starter-kit).

## Installation

`npm i`

## Setup

Create `.env.local`, add values from providers.

```
AUTH0_CLIENT_ID=XXX
AUTH0_CLIENT_SECRET=XXX
AUTH0_ISSUER_BASE_URL=XXX
LIVEBLOCKS_SECRET_KEY=XXX
NEXTAUTH_SECRET=XXX
```

For more info:

- https://liveblocks.io/docs/guides/nextjs-starter-kit#authentication
- https://next-auth.js.org/configuration/options#secret
- https://liveblocks.io/docs/api-reference/rest-api-endpoints

## Development

`npm run dev`

Go to `http://localhost:3000/`.
