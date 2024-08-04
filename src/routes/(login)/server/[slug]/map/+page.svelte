<script>
  import { browser } from "$app/environment";
  import { apiurl } from "$lib/scripts/req";

  let html;
  let id;
  if (browser) {
    id = localStorage.getItem("serverID");
    fetch(apiurl + "server/" + id + "/webmap")
      .then((response) => response.text())
      .then((data) => {
        html = data;

        //for every src...
        for (let i = 0; i < html.split("\n").length; i++) {
          if (html.split("\n")[i].includes("src=")) {
            let src = html.split("\n")[i].split("src=")[1].split('"')[1];
            console.log(src);
            let src2 = src;
            //if src contains standalone/config.js...
            if (src.includes("standalone/config.js")) {
              src2 = "standalone/config.js";
            }
            let newsrc = apiurl + "server/" + id + "/webmap/" + src2;

            //replace the src with the new src
            html = html.replace(src, newsrc);
          }

          if (html.split("\n")[i].includes("href=")) {
            let href = html.split("\n")[i].split("href=")[1].split('"')[1];

            let newhref = apiurl + "server/" + id + "/webmap/" + href;
            console.log(newhref);

            //replace the src with the new src
            html = html.replace(href, newhref);
          }
        }
        document.getElementById("map").innerHTML = html;
      });
  }
</script>

<html lang="en"><head id="map"></head></html>
<iframe title="map" srcdoc={html} style="width:100%;height:100%;"></iframe>
