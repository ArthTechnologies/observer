[![Get at Docker Hub](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/r/arthmc/observer)

### Warnings

- Arth Panel is in beta and should not be used in production yet.

# About Observer

Observer is a frontend for Arth Panel, a lightweight self-hosted Minecraft server panel. Observer is made with HTML/CSS/JS, Node, SvelteKit, TailwindCSS, and DaisyUI.

## Why Arth Panel?

The main panels currently used for running Minecraft servers are bulky, slow, hard to setup, and hard to understand. It could be quite time-consuming to figure out where your servers actually are if you ever choose to ditch a panel like pufferpanel or pterodactyl. So Arth Panel was built from the ground up, with simplicity, design, and performance in mind. It doesn't use docker to contain your servers, so they're right there in the "servers" folder if you ever have a problem with Arth Panel and need to run them directly.

## How to Run with Docker

1. Download the image from docker hub with the command `sudo docker pull arthmc/observer:latest`
2. Run the image with `sudo docker run -p 3000:3000 [Set variables here, see "how to configure"] arthmc/observer:latest`. To change the port, replace the first 3000 with the port number you want.

If you are using an ARM-based machine (Like a Mac or Raspberry Pi):
1. Grab the source code with `git clone https://codeberg.org/arth/observer`
2. Inside the observer folder, run `docker buildx build --platform linux/arm64 . -t arthmc/observer:latest`
3. Run the image with `sudo docker run -p 3000:3000 [Set variables here, see "how to configure"] arthmc/observer:latest`. To change the port, replace the first 3000 with the port number you want.

## How to configure with Docker

In the indicated are in the run command, you can enter enviroment variables to point it to your quartz instance and configure other settings. Each variable is added in this format: `-e PUBLIC_EXAMPLEVARIABLE=true`.

- `PUBLIC_API_URL`: The address of your quartz instance. Make sure the url ends with a `/`.
- `PUBLIC_USING_CURSEFORGE`: Eether to let users add mods from curseforge, not just modrinth. Only enable this if you've set up curseforge on your quartz instance.
- `PUBLIC_STRIPE_PAYMENT_LINK`: The payment link that users will be sent to after making an account IF you've enabled payments and setup stripe on your quartz instance.
- `PUBLIC_USING_OCELOT` (Advanced): Set this to true if you're using ocelot, the system that links multiple quartz instances together.
- `PUBLIC_LR_URL` (Advanced): 
Labrinth is the open-source software behing Modrith, a site where you can download mods and such. If you know another site that is running Labrinth and for some reason want to use that instead of Modrinth, you can tell observer to use that site instead of modrinth via this variable.


## How to run without docker

1. Grab the source code with `git clone https://codeberg.org/arth/observer`
2. Inside the observer folder, Install packages with `npm i`
3. Build the source code with `CI= npm run build`
4. Run with `node build`

You can update observer by running the `git pull` command inside your observer folder.

## How to configure without docker

You'll need to create a file called `.env` inside your observer folder. For each variable, create a new line and format it like this: `PUBLIC_EXAMPLEVARIABLE=true`.
- `PUBLIC_API_URL`: The address of your quartz instance.
- `PUBLIC_USING_CURSEFORGE`: Eether to let users add mods from curseforge, not just modrinth. Only enable this if you've set up curseforge on your quartz instance.
- `PUBLIC_STRIPE_KEY`: If you want to make people pay for servers via stripe, enter the public stripe key found in the dashboard. This will require some setup on the backend as well.
- `PUBLIC_USING_OCELOT` (Advanced): Set this to true if you're using ocelot, the system that links multiple quartz instances together.
- `PUBLIC_LR_URL` (Advanced): 
Labrinth is the open-source software behing Modrith, a site where you can download mods and such. If you know another site that is running Labrinth and for some reason want to use that instead of Modrinth, you can tell observer to use that site instead of modrinth via this variable.

## Other Requirements

- By default, observer will connect to Arth's quartz backend. To create your own functioning service you will need to set up a [quartz](https://github.com/arthmc/quartz) backend and replace the address at the top of src/lib/scripts/req.ts.

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
