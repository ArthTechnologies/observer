[Get at Docker Hub](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
# Observer

Observer is a frontend for Arth Panel, an open-source & self-hosted minecraft server panel. Observer is meant to be run as a docker container, and is made with HTML/CSS/JS, Node, SvelteKit, TailwindCSS, and DaisyUI. 



# How to Run

The reccomended way to run observer is in a docker container. You can pull the image with `docker pull arthmc/observer:latest`, and run with `docker run -p 3000:3000 arthmc/observer:latest`, with the `-p` flag exposing port 3000.

### Check out our [backend](https://github.com/arthmc/quartz)'s progress  

## Why Arth Panel?
The main difference between an alternative like pufferpanel or pterodactyl is that it's meant to work in a way so that if an issue were to occur, you could easily just SSH into the machine and run the jar directly in a folder, so you know that your server's uptime is not dependant on a panel someone else made working flawlessly.  

## Planned Pages

```
/servers (Where all servers you have access too are listed)
/settings (Configure things like site URL)
/newserver (Page to create a new server)
/server/[server technicalname] (page showing eventually terminal)
/signin
/account (manage account/profile)
/billing (add to your balance and view your balance as well as next charges)
```

## Contributing

Contributions are very much appreciated! Feel free to contribute, preferably something on the to-do list. Feel free to open up an issue if you have questions about planned features, API, backend, etc.

# To-do list
✅ Setup a basic node application with Svelte, Tailwind, & DaisyUI.  
✅ Navbar with Arth Panel, Servers, & Settings on left. On right: Night/darkmode button, Create server button, Account button.  
✅ Basic UI for all planned pages  
🔨 Communication with backend  
❌ Basic UI and function for terminal on the frontend  
❌ Balance deposits & withdraws with paypal  
❌ Web Terminal using WebSockets  
❓ Balance deposits & withdraws with stripe  
❓ Decentralized options for accounts and/or paynments  
