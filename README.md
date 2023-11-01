[![Get at Docker Hub](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/r/arthmc/observer)

### Warnings

- Arth Panel is in beta and should not be used in production yet.
- There are some issues with the docker image and we reccomend running observer directly for now.

# About Observer

Observer is a frontend for Arth Panel, a lightweight self-hosted Minecraft server panel. Observer is made with HTML/CSS/JS, Node, SvelteKit, TailwindCSS, and DaisyUI.

## Why Arth Panel?

The main panels currently used for running Minecraft servers are bulky, slow, hard to setup, and hard to understand. It could be quite time-consuming to figure out where your servers actually are if you ever choose to ditch a panel like pufferpanel or pterodactyl. So Arth Panel was built from the ground up, with simplicity, design, and performance in mind. It doesn't use docker to contain your servers, so they're right there in the "servers" folder if you ever have a problem with Arth Panel and need to run them directly.

## How to run without docker

1. Grab the source code with `git clone https://codeberg.org/arth/quartz`
2. Install packages with `npm i`
3. Build the source code with `CI= npm run build`
4. Run with `node build`

You can update observer by running the `git pull` command inside your observer folder.

## How to configure without docker

- Go into `src/lib/scripts/req.ts` and change `apiurl` to the url of your quartz instance.
- Advanced: If you have setup an ocelot master-backend instance, go into `src/lib.scripts/req.ts` and change `useOcelot` to `true` and set `apiurl` to the url of your ocelot instance.
- WARNING: Whenever you update quartz, you may need to change the values in `req.ts` that you changes back to their origional values. We apologize for the inconvenience and hope to fix this soon.

## Other Requirements

- By default, observer will connect to Arth's quartz backend. To create your own functioning service you will need to set up a [quartz](https://github.com/arthmc/quartz) backend and replace the address at the top of src/lib/scripts/req.ts.

## How to Run with Docker

1. Download the image from docker hub with the command `sudo docker pull arthmc/observer:latest`
2. Run the image with `sudo docker run -p 3000:3000 arthmc/observer:latest`. To change the port, replace the first 3000 with the port number you want.

# Contributing

## How to run a dev server

- Make sure you install the packages by running `npm i`
- To run a dev server, enter the command `npm run dev`
- If you need to mimic a production environment for something like working with Service Workers, enter `npm run preview` instead.

## Contributing Guidelines

- Please format your code with Prettier, or an alternative that achieves the same results.
- Please use [Lucide Icons](https://lucide.dev)(Included as an npm package) for svg icons & use webp for raster images whenever possible. If you're wondering what tools have been used to make images like the arth logo (seen on arthmc.xyz) and the favicon, they were made with Lunacy.

### Check out our [backend](https://github.com/arthmc/quartz)'s progress

# To-do list

✅ Setup a basic node application with Svelte, Tailwind, & DaisyUI.  
✅ Navbar with Arth Panel, Servers, & Settings on left. On right: Night/darkmode button, Create server button, Account button.  
✅ Basic UI for all planned pages  
✅ Communication with backend  
✅ Subscriptions with stripe  
✅ Basic UI and function for terminal on the frontend  
❌ Signin via discord
