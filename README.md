# Kunai Repository manager
## A Qwik City App ⚡️


- [Qwik Docs](https://qwik.dev/)
- [Discord](https://qwik.dev/chat)
- [Qwik GitHub](https://github.com/QwikDev/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

---

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.dev/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
    |   └── ...
    ├── db/
    │   └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.dev/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `src/db`: Recommended directory for database models, database connections, and database queries.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Development (we use pnpm)

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
pnpm start # or `yarn start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
pnpm run preview # or `yarn preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
pnpm run build # or `yarn build`
```


Basic setup to get the app running locally:

** We use a private package for our styling @kunai-design-system(https://github.com/kunai-consulting/kunai-design-system), so, please reach out to @PatrickJS @PatrickJS-kunaico to be added to the kunai-consulting npm organization. **THE APP WILL NOT WORK IF YOU DO NOT HAVE ACCESS TO THE PRIVATE REGISTRY.** **

```
pnpm install
pnpm run build
pnpm run dev
```


## Cloudflare Pages

Cloudflare's [wrangler](https://github.com/cloudflare/wrangler) CLI can be used to preview a production build locally. To start a local server, run:

```
pnpm run serve
```

Then visit [http://localhost:5173/](http://localhost:5173/)

### Deployments

- deploy to cloudflare pages

```
pnpm run build
pnpm run deploy
```


### Function Invocation Routes

Cloudflare Page's [function-invocation-routes config](https://developers.cloudflare.com/pages/platform/functions/routing/#functions-invocation-routes) can be used to include, or exclude, certain paths to be used by the worker functions. Having a `_routes.json` file gives developers more granular control over when your Function is invoked.
This is useful to determine if a page response should be Server-Side Rendered (SSR) or if the response should use a static-site generated (SSG) `index.html` file.

By default, the Cloudflare pages adaptor _does not_ include a `public/_routes.json` config, but rather it is auto-generated from the build by the Cloudflare adaptor. An example of an auto-generate `dist/_routes.json` would be:

```
{
  "include": [
    "/*"
  ],
  "exclude": [
    "/_headers",
    "/_redirects",
    "/build/*",
    "/favicon.ico",
    "/manifest.json",
    "/service-worker.js",
    "/about"
  ],
  "version": 1
}
```

In the above example, it's saying _all_ pages should be SSR'd. However, the root static files such as `/favicon.ico` and any static assets in `/build/*` should be excluded from the Functions, and instead treated as a static file.

In most cases the generated `dist/_routes.json` file is ideal. However, if you need more granular control over each path, you can instead provide you're own `public/_routes.json` file. When the project provides its own `public/_routes.json` file, then the Cloudflare adaptor will not auto-generate the routes config and instead use the committed one within the `public` directory.


## How to build onto this project for your own use 

So you have the project running locally, 
lets make sure we have the right setup for your own use.
setup with your own github oAath app, env variables, etc.

### Follow these steps:

### Step 1: Set up your Github OAuth App or add your own private key to an existing one

Go to https://github.com/settings/developers and create a new OAuth App.

***Make sure that the authorization callback URL is set to** `"homepage URL" + /auth/callback/github` i.e. 

homepage URL = `http://localhost:1000/`

then

authorization callback URL = `http://localhost:1000/auth/callback/github`

* If your org already has an oauth app setup, you can add your own private key to it, and put the client id and secret in the repo secrets. *

***MAKE SURE TO COPY THE CLIENT SECRET PROVIDED ONCE YOU CREATE THE OAUTH APP**

### Step 3: Add client id/client secret to your .ENV file .ENV.local file

```
AUTH_GITHUB_ID=your_client_id
AUTH_GITHUB_SECRET=your_client_secret
```

### Reach out in #open-source with any questions, or to @nabrams-kunaico or @benjamin-kunai for help. ! 