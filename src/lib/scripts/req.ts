import accountEmail from "$lib/stores/accountEmail";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
export const apiurl = "https://api.arthmc.xyz/";

export const lrurl = "https://api.modrinth.com/v2/";
let lock = false;

let GET = {};
let POST = {};
let DELETE = {};
//set email from local storage to variable
if (browser) {
  accountEmail.set(localStorage.getItem("accountEmail"));
if (localStorage.getItem("x") == undefined) {
  localStorage.setItem("x", "false");
  localStorage.setItem("loggedIn", "false");
} 
 GET = { method: "GET",
headers: {
  "token": localStorage.getItem("token"),
  "email": localStorage.getItem("accountEmail"),
}
};
 POST = { method: "POST",
headers: {
  "token": localStorage.getItem("token"),
  "email": localStorage.getItem("accountEmail"),
} };
 DELETE = { method: "DELETE",
headers: {
  "token": localStorage.getItem("token"),
  "email": localStorage.getItem("accountEmail"),
} };
}



export function setInfo(id, icon, desc) {
  console.log(id);
  const url = apiurl + "server/" + id + "/setInfo";
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": localStorage.getItem("token"),
      "email": localStorage.getItem("accountEmail"),
    },
    body: JSON.stringify({
      desc: desc,
      icon: icon,
    }),
  };

 //if image isnt taller than it is wide, run code. keep in mind icon is just a url
 let img = new Image();
  img.src = icon;
  img.onload = function() {
    if (img.height <= img.width) {

  return fetch(url, req)
  .then((res) => res.text())
  .then((input: string) => {
    console.log("Response Recieved: " + input);

    if (input.indexOf("400") > -1) {
      return "error"; 
    } else {
      return "success";
    }
  })
  .catch((err) => console.error(err));
  } else {
    alert("Image can't be taller than it is wide" + img.height + " " + img.width)
  }
}
}

export function getMods(id: number, modtype: string) {
  const url = apiurl + "server/" + id + "/" + modtype;
  return fetch(url, GET)
    .then((res) => res.text())
    .then((input: string) => {
      console.log("Response Recieved: " + input);

      return JSON.parse(input);
    })
    .catch((err) => console.error(err));
}

export function sendVersion(
  link: string,
  id: string,
  pluginId: string,
  pluginName: string,
  modtype: string
) {
  const url =
    apiurl +
    "server/" +
    id +
    "/add/" + modtype + 
    "?pluginUrl=" +
    encodeURIComponent(link) +
    "&id=" +
    encodeURIComponent(pluginId) +
    "&name=" +
    encodeURIComponent(pluginName);
  console.log(url);
  return fetch(url, POST)
    .then((res) => res.text())
    .then((input: string) => {
      console.log("Response Recieved: " + input);

      if (input.indexOf("400") > -1) {
        return "error";
      } else {
        return "success";
      }
    })
    .catch((err) => console.error(err));
}
export function getVersions(id: string) {
  const url = lrurl + "project/" + id + "/version";
  return fetch(url, GET)
    .then((res) => res.text())
    .then((input: string) => {
      console.log("Response Recieved: " + input);

      return JSON.parse(input);
    })
    .catch((err) => console.error(err));
}



export function searchPlugins(
  software: string,
  version: string,
  query: string
) {
  if (version == "Latest") {
    version = "1.19.3";
  }

  const url =
    lrurl +
    "search" +
    "?query=" +
    query +
    '&facets=[["categories:' +
    software +
    '"],["client_side:optional","client_side:unsupported"],["server_side:optional","server_side:required"]]' +
    "&limit=10";

  if (!lock) {
    return fetch(url, GET)
      .then((res) => res.text())
      .then((input: string) => {
        console.log("Response Recieved: " + input);

        if ((input.indexOf("ck_block") > -1) | (input == undefined)) {
          lock = true;
        }
        return JSON.parse(input);
      })
      .catch((err) => console.error(err));
  }
}

export function searchMods(
  software: string,
  version: string,
  query: string
) {
  if (version == "Latest") {
    version = "1.19.3";
  }

  const url =
    lrurl +
    "search" +
    "?query=" +
    query +
    '&facets=[["categories:' +
    software +
    '"], ["project_type:modpack"], ["client_side:optional","client_side:unsupported"],["server_side:optional","server_side:required"]]' +
    "&limit=10";

  if (!lock) {
    return fetch(url, GET)
      .then((res) => res.text())
      .then((input: string) => {
        console.log("Response Recieved: " + input);

        if ((input.indexOf("ck_block") > -1) | (input == undefined)) {
          lock = true;
        }
        return JSON.parse(input);
      })
      .catch((err) => console.error(err));
  }
}

export function getSettings() {
  console.log("Request Sent");
  return fetch(apiurl + "settings", GET)
    .then((res) => res.text())
    .then((input: string) => {
      console.log("Response Recieved: " + input);
      if (browser) {
        window.localStorage.setItem("enablePay", JSON.parse(input).enablePay);
        window.localStorage.setItem("enableAuth", JSON.parse(input).enableAuth);
        window.localStorage.setItem("address", JSON.parse(input).address);

        if (JSON.parse(input).enableAuth == false) {
          window.localStorage.setItem("accountEmail", "guest");
          accountEmail.set("guest");
        }
      }

      return JSON.parse(input);
    })
    .catch((err) => console.error(err));
}

export function getServers(em: string) {
  const url = apiurl + "servers/" + "?email=" + em;
  console.log("Request Sent: Get Servers");


  return fetch(url, GET)
    .then((res) => res.text())
    .then((input: string) => {
      console.log("Response Recieved: " + input);
      if (input.indexOf("Invalid credentials.") > -1) {
       
        return "error";
      } else {
        //return input as json
        return JSON.parse(input);
      }
    })
    .catch((err) => console.error(err));
}
export function signupEmail(em: string, pwd: string) {

  console.log("Request Sent");
  localStorage.setItem("accountEmail", em);
  return fetch(apiurl + "accounts/email/signup?" + new URLSearchParams({
    email: em,
    password: pwd,
    confirmPassword: pwd
}), POST)
    .then((res) => res.text()).then((input: string) => {
    
        console.log(input)
      
  
        localStorage.setItem("loggedIn", "true");
          localStorage.setItem("token", JSON.parse(input).token);
          localStorage.setItem("accountId", JSON.parse(input).accountId);
          GET = { method: "GET",
          headers: {
            "token": localStorage.getItem("token"),
            "email": localStorage.getItem("accountEmail"),
          }
          };
           POST = { method: "POST",
          headers: {
            "token": localStorage.getItem("token"),
            "email": localStorage.getItem("accountEmail"),
          } };
           DELETE = { method: "DELETE",
          headers: {
            "token": localStorage.getItem("token"),
            "email": localStorage.getItem("accountEmail"),
          } };
          if (JSON.parse(input).token == -1) {


            return(JSON.parse(input).reason)
           
          }
          return true;
        
      })
      .catch((err) => console.error(err));
     
}


export function loginEmail(em: string, pwd: string) {


  
  return fetch(apiurl + "accounts/email/signin?" + new URLSearchParams(
    {
      email: em,
      password: pwd
    }
  ), POST)
    .then((res) => res.text())
    .then((input: string) => {
      



      if (JSON.parse(input).token == -1) {
        console.log(JSON.parse(input))
        return(JSON.parse(input).reason)
      } else {
        if (browser) {
          console.log(JSON.parse(input))
          window.localStorage.setItem("token", JSON.parse(input).token);
          window.localStorage.setItem("accountEmail", em);
          window.localStorage.setItem("loggedIn", "true");
          GET = { method: "GET",
          headers: {
            "token": localStorage.getItem("token"),
            "email": localStorage.getItem("accountEmail"),
          }
          };
           POST = { method: "POST",
          headers: {
            "token": localStorage.getItem("token"),
            "email": localStorage.getItem("accountEmail"),
          } };
           DELETE = { method: "DELETE",
          headers: {
            "token": localStorage.getItem("token"),
            "email": localStorage.getItem("accountEmail"),
          } };

        }
        return true;
      }
    })
    .catch((err) => console.error(err));
}

export function changeServerState(reqstate: string, id: number, em: string) {
  const url = apiurl + "server/" + id + "/state/" + reqstate + "?email=" + em;
  const response = fetch(url, POST)
    .then((res) => res.text())
    .then((text) => console.log("Response Recieved: " + text))
    .catch((err) => console.error(err));

  return "done";
}

export function createServer(
  n: string,
  s: string,
  v: string,
  a: any[],
  c: any[],
  mURL:string,
) {
  const url =
    apiurl +
    "server/new?" +
    "email=" +
    window.localStorage.getItem("accountEmail");

  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": window.localStorage.getItem("token"),
      "email": window.localStorage.getItem("accountEmail"),
    },
    body: JSON.stringify({
      name: n,
      software: s,
      version: v,
      addons: a,
      cmds: c,
      modpackURL: mURL
    }),
  };
  console.log("Request Sent: " + JSON.stringify(req.body));
  //if response is 409, send an alert, otherwise do nothing
  const response = fetch(url, req)
    .then((res) => res.text())
    .then((text) => {
      console.log("Response Recieved: " + text);
      if (text.indexOf("exists") > -1) {
        alert("Sorry, that name is taken.");

        //set localstorage x to true
        window.localStorage.setItem("x", "true");
      } else if (text.indexOf("Funds") > -1) {
        alert("You don't have enough money to make a new server.");
        window.localStorage.setItem("x", "true");
      } else if (text.indexOf("Subscribe") > -1) {
        alert("You need to subscribe first.");
        window.localStorage.setItem("x", "true");
      } else if (text.indexOf("Success") == -1) {
        alert("Sorry, something went wrong.");
        window.localStorage.setItem("x", "true");
      } else {
        //set text.subscription to localstorage
        if (browser) {
          window.localStorage.setItem("subs", JSON.parse(text).subscriptions);
          //if localstorage servers is null, set it to 0
          if (window.localStorage.getItem("servers") == null) {
            window.localStorage.setItem("servers", "0");
          }
          //increase localstorage servers by 1
          window.localStorage.setItem(
            "servers",
            (parseInt(localStorage.getItem("servers")) + 1).toString()
          );
        }
      }
    })
    .catch((err) => console.error(err));

  return "done";
}

export function getPlayers(address: string) {
  const req = {
    method: "GET",
  };
  console.log("Request Sent");
  return fetch("https://api.mcsrvstat.us/2/" + address, req)
    .then((res) => res.text())

    .then((text: string) => {
      console.log("Response Recieved: " + text);

      //return whats after ""online":" and before ","max"

      console.log(
        text.substring(text.indexOf("online") + 8, text.indexOf("max") - 2)
      );
      return parseInt(
        text.substring(text.indexOf("online") + 8, text.indexOf("max") - 2)
      );

      // return input as a number
    });
}

export function getServer(id: number) {
  const url = apiurl + "server/" + id;
  return fetch(url, GET)
    .then((res) => res.text())
    .then((input: string) => {
      if (input.indexOf("400") > -1) {
        return "error";
      } else {
        //return input as json
        return JSON.parse(input);
      }
    });
}

export function deleteServer(id: number) {
  const url = apiurl + "server/" + id;

  return fetch(url, DELETE)
    .then((res) => res.text())
    .then((input: string) => {
      if (input.indexOf("400") > -1) {
        return "error";
      } else {
        //return input as json
        return JSON.parse(input);
      }
    });
}

export function writeTerminal(id: number, cmd: string) {
  const url = apiurl + "terminal/" + id + "?cmd=" + cmd;
  return fetch(url, POST)
    .then((res) => res.text())
    .then((input: string) => {
      if (input.indexOf("400") > -1) {
        return "error";
      } else {
        //return input as json
        console.log(JSON.stringify(input));
        return "success";
      }
    });
}

export function readTerminal(id: number) {
  const url = apiurl + "terminal/" + id;
  return fetch(url, GET)
    .then((res) => res.text())
    .then((input: string) => {
      if (input.indexOf("400") > -1) {
        return "error";
      } else {
        //return input as json
        return input;
      }
    });
}

//check if stripe is enabled
getSettings();
