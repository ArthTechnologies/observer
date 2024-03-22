import accountEmail from "$lib/stores/accountEmail";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { env } from '$env/dynamic/public'
import Alert from "$lib/components/ui/Alert.svelte";
import { alert } from "./utils";

export let apiurl = "http://localhost:4000/";
export let usingOcelot = false;
export let lrurl = "https://api.modrinth.com/v2/";
export let stripeKey = "";
export let usingCurseForge = false;
export let basicPlanPrice = "$3.49";
export let moddedPlanPrice = "$4.99";
export let customerPortalLink = "";


//set apiurl & usingOcelot to the enviroment variable if it exists
if (browser) {
  if (env.PUBLIC_API_URL) {
    apiurl = env.PUBLIC_API_URL;
  }
  if (env.PUBLIC_USING_OCELOT) {
    usingOcelot = JSON.parse(env.PUBLIC_USING_OCELOT);
  }
  if (env.PUBLIC_LR_URL) {
    lrurl = env.PUBLIC_LR_URL;
  }
  if (env.PUBLIC_STRIPE_KEY) {
    stripeKey = env.PUBLIC_STRIPE_KEY;
  }
  if (env.PUBLIC_USING_CURSEFORGE) {
    usingCurseForge = JSON.parse(env.PUBLIC_USING_CURSEFORGE);
  }

  if (env.PUBLIC_BASIC_PLAN_PRICE) {
    basicPlanPrice = env.PUBLIC_BASIC_PLAN_PRICE;
  }

  if (env.PUBLIC_MODDED_PLAN_PRICE) {
    moddedPlanPrice = env.PUBLIC_MODDED_PLAN_PRICE;
  }

  if (env.PUBLIC_CUSTOMER_PORTAL_LINK) {
    customerPortalLink = env.PUBLIC_CUSTOMER_PORTAL_LINK;
  }


  //Migration from old email-only account system to new multi-type account system
  if (localStorage.getItem("accountEmail") != null && localStorage.getItem("accountEmail").split(":")[1] == undefined && localStorage.getItem("accountEmail") != "noemail") {
    localStorage.setItem("accountEmail", "email:" + localStorage.getItem("accountEmail"));
  }
}

let lock = false;

let GET = {};
let POST = {};
let DELETE = {};
export function updateReqTemplates() {
//set email from local storage to variable
if (browser) {
  accountEmail.set(localStorage.getItem("accountEmail"));
  if (localStorage.getItem("x") == undefined) {
    localStorage.setItem("x", "false");
    localStorage.setItem("loggedIn", "false");
  }
  if (localStorage.getItem("theme") == undefined) {
    localStorage.setItem("theme", "dark");
  }
  GET = {
    method: "GET",
    headers: {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("accountEmail"),
    },
  };
  POST = {
    method: "POST",
    headers: {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("accountEmail"),
    },
  };
  DELETE = {
    method: "DELETE",
    headers: {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("accountEmail"),
    },
  };
}
}
updateReqTemplates();

export function setInfo(
  id,
  icon,
  desc,
  proxiesEnabled,
  fSecret,

) {
  if(browser) {
  console.log(icon);
  if (icon == "") {
    icon = "/images/placeholder.png";
  }
  let baseurl = apiurl;
  if (usingOcelot)
    baseurl =
      getServerNode(id);
  const url = baseurl + "server/" + id + "/setInfo";
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
      username: localStorage.getItem("accountEmail"),
    },
    body: JSON.stringify({
      desc: desc,
      icon: icon,
      proxiesEnabled: proxiesEnabled,
      fSecret: fSecret,

    }),
  };

  //if image isnt taller than it is wide, run code. keep in mind icon is just a url
  let img = new Image();
  img.src = icon;
  if (icon != "") {
    img.onload = function () {
      if (img.height <= img.width) {
        return fetch(url, req)
          .then((res) => res.text())
          .then((input: string) => {
            console.log("Response Recieved: " + input);

            if (input.indexOf("400") > -1) {

              return "error";
            } else {
              setDescText(desc);
              return "success";
            }
          })
          .catch((err) => console.error(err));
      } else {
       
        alert("Error setting server icon. Try again with a square image.", "error");
      }
    };
  } else {
    return fetch(url, req)
      .then((res) => res.text())
      .then((input: string) => {
        console.log("Response Recieved: " + input);

        if (input.indexOf("400") > -1) {
          return "error";
        } else {
          setDescText(desc);
          return "success";
        }
      })
      .catch((err) => console.error(err));
  }
  function setDescText(desc) {
    if (document.getElementById("xDesc") != null) {
      document.getElementById("xDesc").innerHTML = "Description: " + desc;
    }
  }
}
}

export function getMods(id: number, modtype: string) {
  if(browser) {
  let baseurl = apiurl;
  if (usingOcelot)
    baseurl =
      getServerNode(id);
  const url = baseurl + "server/" + id + "/" + modtype;
  return fetch(url, GET)
    .then((res) => res.text())
    .then((input: string) => {
      console.log("Response Recieved: " + input);

      return JSON.parse(input);
    })
    .catch((err) => console.error(err));
  }
}

export function sendVersion(
  link: string,
  id: string,
  pluginId: string,
  pluginName: string,
  modtype: string
) {
  if(browser) {
  let baseurl = apiurl;
  if (usingOcelot)
    baseurl =
      getServerNode(id);
  const url =
    baseurl +
    "server/" +
    id +
    "/add/" +
    modtype +
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
}
export function getVersions(id: string) {
  if(browser) {
  const url = lrurl + "project/" + id + "/version";
  return fetch(url, GET)
    .then((res) => res.text())
    .then((input: string) => {
      console.log("Response Recieved: " + input);

      return JSON.parse(input);
    })
    .catch((err) => console.error(err));
}
}

export function searchPlugins(
  software: string,
  version: string,
  query: string,
  offset: number,
  sortBy: string,
  categories: Array<string>
) {
  sortBy = sortBy.toLowerCase();
  if(browser) {
  if (version == "Latest") {
    version = "1.19.3";
  }
  query = query.replace(" ", "-");
  let versionString = '["versions:' +
  version +
  '"],';
  if (version == "any") versionString = "";
  let categoriesString = "";
  if (categories.length > 0) {
    categoriesString = '["categories:'+categories.join('"],["categories:')+'"],';
    categoriesString = categoriesString.replace(/ /g, "_");
  }

  const url =
    lrurl +
    "search" +
    "?query=" +
    query +
    '&facets=[["categories:' +
    software + 
    '"],'+ versionString +
    categoriesString+'["server_side:optional","server_side:required"]]' +
    "&limit=15" +
    "&offset=" + offset +
    "&index=" + sortBy;
    console.log(url)
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
}

export function searchMods(
  platform: string,
  software: string,
  version: string,
  query: string,
  modtype: string,
  offset: number,
  sortBy: string
) {
  sortBy = sortBy.toLowerCase();
  if(browser) {
      if (version == "Latest") {
    version = "1.19.3";

  }
  query = query.replace(" ", "-");
  let url;

  if (platform == "mr")  {
    url =
    lrurl +
    "search" +
    "?query=" +
    query +
    '&facets=[["categories:' +
    software +
    '"], ["project_type:' +
    modtype +
    '"],["versions:' +
    version +
    '"],["server_side:optional","server_side:required"]]' +
    "&limit=15" +
    "&offset=" + offset +
    "&index=" + sortBy;
  } else if (platform == "cf") {
    let sf = 0;
    switch (sortBy) {
      case "relevance":
        sf = 1;
        break;
      case "downloads":
        sf = 6;
        break;
      case "updated":
        sf = 3;
        break;
    }

    let classId = 6;
    if (modtype == "modpack") {
     classId = 4471;
    }
    url =
    apiurl +
    "curseforge/search" +
    "?query=" +
    query +
    '&version=' +
    version +
    '&loader=' +
    software +
    '&classId=' +
    classId +
    '&index=' + offset +
    "&sortField=" + sf;
  }

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
}

export function getSettings() {
  if(browser) {
  console.log("Request Sent");
  return fetch(apiurl + "info/", GET)
    .then((res) => res.text())
    .then((input: string) => {
      console.log("Response Recieved: " + input);
      if (browser) {
        localStorage.setItem("enablePay", JSON.parse(input).enablePay);
        localStorage.setItem("enableAuth", JSON.parse(input).enableAuth);
        localStorage.setItem("address", JSON.parse(input).address);
        localStorage.setItem("latestVersion", JSON.parse(input).latestVersion);
        localStorage.setItem("enableVirusScan", JSON.parse(input).enableVirusScan);
        localStorage.setItem("enableCloudflareVerify", JSON.parse(input).enableCloudflareVerify);
        localStorage.setItem("cloudflareVerifySiteKey", JSON.parse(input).cloudflareVerifySiteKey);
        localStorage.setItem("enableDeepL", JSON.parse(input).enableDeepL);

        if (JSON.parse(input).enableAuth == false) {
          localStorage.setItem("accountEmail", "guest");
          accountEmail.set("guest");
        }
      }

      return JSON.parse(input);
    })
    .catch((err) => console.error(err));
}
}

export function getServers(em: string) {
  if(browser) {
  let url =
      apiurl + "info/servers?accountId=" + localStorage.getItem("accountId");
  
  console.log("Request Sent: Get Servers");

  return fetch(url, GET)
    .then((res) => res.text())
    .then((input: string) => {
      if (browser) {
        localStorage.setItem("amountOfServers", JSON.parse(input).length);
        localStorage.setItem("servers", input);

        if (usingOcelot) getServerNodes();
      }

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
}

export function signupEmail(em: string, pwd: string, cloudflareVerifyToken:string = "") {
  if(browser) {
  console.log("Request Sent");
  localStorage.setItem("accountEmail", "email:" + em);
  return fetch(
    apiurl +
      "accounts/email/signup?" +
      new URLSearchParams({
        username: em,
        password: pwd,
        confirmPassword: pwd,
        cloudflareVerifyToken: encodeURIComponent(cloudflareVerifyToken)
      }),
    POST
  )
    .then((res) => res.text())
    .then((input: string) => {
      console.log(input);

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("token", JSON.parse(input).token);
      localStorage.setItem("accountId", JSON.parse(input).accountId);
      localStorage.setItem("avatar", "");
      updateReqTemplates();
      if (JSON.parse(input).token == -1) {
        return JSON.parse(input).reason;
      }
      return true;
    })
    .catch((err) => console.error(err));
}
}

export function loginEmail(em: string, pwd: string, cloudflareVerifyToken:string = "") {
  if(browser) {
  return fetch(
    apiurl +
      "accounts/email/signin?" +
      new URLSearchParams({
        username: em,
        password: pwd,
        cloudflareVerifyToken: cloudflareVerifyToken
      }),
    POST
  )
    .then((res) => res.text())
    .then((input: string) => {
      if (
        JSON.parse(input).token == -1 ||
        JSON.parse(input).status == "ERROR"
      ) {
        console.log(JSON.parse(input));
        return JSON.parse(input).reason;
      } else {
        if (browser) {
          console.log(JSON.parse(input));
          localStorage.setItem("token", JSON.parse(input).token);
          localStorage.setItem("accountEmail", "email:" + em);
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("accountId", JSON.parse(input).accountId);
          localStorage.setItem("avatar", "");
          updateReqTemplates();
        }
        return true;
      }
    })
    .catch((err) => console.error(err));
}
}

export function changeServerState(reqstate: string, id: number, em: string) {
  if(browser) {
  let baseurl = apiurl;
  if (usingOcelot)
    baseurl =
      getServerNode(id);
  const url = baseurl + "server/" + id + "/state/" + reqstate + "?username=" + em;
  const response = fetch(url, POST)
    .then((res) => res.text())
    .then((text) => console.log("Response Recieved: " + text))
    .catch((err) => console.error(err));

  return "done";
}
}

export function createServer(
  id: number,
  n: string,
  s: string,
  v: string,
  a: any[],
  c: any[],
  mURL: string,
  mID: string,
  vID: string,

) {
  if(browser) {
    let baseurl = apiurl;
  if (usingOcelot)
    baseurl =
      getServerNode(id);
      console.log("getting server node for " + id + "...", baseurl);
    const url  =
      baseurl +
      "server/new/"+id+"?" +
      "email=" +
      localStorage.getItem("accountEmail") +
      "&accountId=" +
      localStorage.getItem("accountId");
  
  //get file from id worldFile
  const req = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
      username: localStorage.getItem("accountEmail"),
    },
    body: JSON.stringify({
      name: n,
      software: s,
      version: v,
      addons: a,
      cmds: c,
      modpackURL: mURL,
      modpackID: mID,
      modpackVersionID: vID,
    }),
  };

  console.log("Request Sent: " + JSON.stringify(req.body));
  //if response is 409, send an alert, otherwise do nothing
  return fetch(url, req).then((res) =>
    res
      .json()
      .then((res) => {
        console.log("Response Recieved: " + JSON.stringify(res));

        //if status code starts with 4
        if (res.success == false) {
          if (browser) {
            return res.msg;
          }
        } else {
          //set text.subscription to localstorage
          if (browser) {
            localStorage.setItem("subs", res.subscriptions);
            //if localstorage servers is null, set it to 0
            if (localStorage.getItem("amountOfServers") == null) {
              localStorage.setItem("amountOfServers", "0");
            }
            //increase localstorage servers by 1
            localStorage.setItem(
              "servers",
              (parseInt(localStorage.getItem("amountOfServers")) + 1).toString()
            );
          }
          return true;
        }
      })
      .catch((err) => console.error(err))
  );
}
}

export function getPlayers(address: string) {
  if(browser) {
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
}

export function getServer(id: number) {
  if (browser) {
  let baseurl = apiurl;
  if (usingOcelot)
    baseurl =
      getServerNode(id);
  const url = baseurl + "server/" + id;
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
}

export function deleteServer(id: number, password: string) {
  if(browser) {
    console.log("deleting3...");
  let baseurl = apiurl;
  if (usingOcelot)
    baseurl =
      getServerNode(id);
  const url =
    baseurl +
    "server/" +
    id +
    "?username=" +
    localStorage.getItem("accountEmail") +
    "&password=" +
    password;
    console.log("deleting3.5..." + url);
  return fetch(url, DELETE)
    .then((res) => res.text())
    .then((input: string) => {
      
      console.error(input);
      if (input.indexOf("Invalid credentials") > -1) {
        alert("Wrong password")
        return "wrong password";
      }else {
        console.log("redring1...")
        localStorage.setItem(
          "servers",
          (parseInt(localStorage.getItem("amountOfServers")) - 1).toString()
        );
        console.log("redring2...")
        goto("/");
                      //this tells the navbar to update the icon that is highligted
                      window.dispatchEvent(new Event("redrict"));
        //return input as json
        return JSON.parse(input);
      }
    });
}
}

export function writeTerminal(id: number, cmd: string) {
  if(browser) {
  let baseurl = apiurl;
  if (usingOcelot)
    baseurl =
      getServerNode(id);
  const url = baseurl + "terminal/" + id + "?cmd=" + cmd;
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
}

export function readTerminal(id: number) {
  if(browser) {
  let baseurl = apiurl;
  if (usingOcelot)
    baseurl =
      getServerNode(id);
  const url = baseurl + "terminal/" + id;
  return fetch(url, GET)
    .then((res) => res.text())
    .then((input: string) => {
      //return input as json
      return input;
    });
}
}

export function updateServer(id: number, version: string) {
  if(browser) {
  let baseurl = apiurl;
  if (usingOcelot)
    baseurl =
      getServerNode(id);
  const url = baseurl + "server/" + id + "/version?version=" + version;
  return fetch(url, POST)
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
}

function getServerNodes() {
  if(browser) {
  let serverIdArray = [];
  const servers = JSON.parse(localStorage.getItem("servers"));
  for (let i = 0; i < servers.length; i++) {
    serverIdArray.push(servers[i].id);
  }
  const url = apiurl + "serverNodes";
  return fetch(url, GET)
    .then((res) => res.text())
    .then((input: string) => {
      console.log("Response Recieved: " + input);
      localStorage.setItem("serverNodes", input);
      //return input as json
      return input;
    });
}
}

export function getServerNode(id: number) {
  if(browser) {
  let serverNodes = JSON.parse(localStorage.getItem("serverNodes"));
  for (let i in serverNodes) {
    let ids = serverNodes[i].split("__")[0].split("-");
    let url = serverNodes[i].split("__")[1];
    console.log (id + ">=" + parseInt(ids[0]) + "&&" + id + "<=" + parseInt(ids[1]))
    if (id >= parseInt(ids[0]) && id <= parseInt(ids[1])) {
      return url;
    }
  }
}
}

//check if stripe is enabled
getSettings();
