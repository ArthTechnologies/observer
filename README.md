[![Get at Docker Hub](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/r/arthmc/observer)

### Warnings

- Arth Panel is in beta and should not be used in production yet.
- There are several issues with the docker image currently, and we reccomend running observer directly for now.

# About Observer

Observer is a frontend for Arth Panel, a lightweight self-hosted Minecraft server panel. Observer is made with HTML/CSS/JS, Node, SvelteKit, TailwindCSS, and DaisyUI. For testing purposes, there is an instance of observer running at https://servers.arthmc.xyz/

## How to run without docker

1. Grab the source code with `git clone https://codeberg.org/arth/quartz`
2. Install packages with `npm i`
3. Build the source code with `CI= npm run build`
4. Run with `node build`

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
- Please use [feather](https://feathericons.com) for svg icons & use webp for raster images whenever possible. If you're wondering what tools have been used to make images like the arth logo (seen on arthmc.xyz) and the favicon, they were made with Lunacy.

### Check out our [backend](https://github.com/arthmc/quartz)'s progress

## Why Arth Panel?

The main difference between Arth Panel and an alternative like pufferpanel or pterodactyl is that it's meant to work in a way so that if an issue were to occur, you could easily just SSH into the machine and run the jar directly in a folder, so you know that your server's uptime is not dependant on a panel someone else made working flawlessly.

## Pages

```
/servers (Where all servers you have access too are listed)
/server/[slug] (Where you can access a server's terminal, edit information, and more.)
/settings (Configure things like site URL)
/newserver (Page to create a new server)
/setup (Page for the panel owner to set everything up)
/pay (manage subscriptions)
/subscription-success (stripe redricts users to this page, which has a button to create a server)
/server/[server technicalname] (page showing eventually terminal)
/signin
```

# To-do list

✅ Setup a basic node application with Svelte, Tailwind, & DaisyUI.  
✅ Navbar with Arth Panel, Servers, & Settings on left. On right: Night/darkmode button, Create server button, Account button.  
✅ Basic UI for all planned pages  
✅ Communication with backend  
✅ Subscriptions with stripe  
✅ Basic UI and function for terminal on the frontend  
❌ Signin via discord  
❓ Decentralized options for accounts
