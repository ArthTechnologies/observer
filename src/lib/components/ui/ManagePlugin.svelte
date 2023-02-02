<script lang="ts">
  export let name;
  export let id;
  export let platform;
  let author;
  let desc;
  if (platform == "lr") {
    //GET https://api.modrinth.com/v2/project/Lu3KuzdV, store author
    fetch("https://api.modrinth.com/v2/project/" + id)
      .then((response) => response.json())
      .then((data) => {
        desc = data.description;
      });
  } else if (platform == "gh") {
    author = id.split("/")[0];
    fetch("https://api.github.com/repos/" + id)
      .then((response) => response.json())
      .then((data) => {
        desc = data.description;
      });
  } else if (platform == "cx") {
    switch (name) {
      case "Geyser":
        desc =
          "A bridge/proxy allowing you to connect to Minecraft: Java Edition servers with Minecraft: Bedrock Edition. ";
        break;
      case "Floodgate":
        desc =
          "An addon to Geyser that removes the need for Bedrock players to log in with a Java Edition account.";
        break;
    }
  }

  console.log(platform + name);
</script>

<div class="bg-base-200 rounded-lg p-3">
  {#if platform == "lr"}
    <div class="flex justify-between place-items-center">
      <div class="flex space-x-3">
        <div>
          <div class="flex space-x-1">
            <div class="flex space-x-1.5 place-items-end ">
              <a
                href="https://modrinth.com/plugin/{id}"
                target="_blank"
                class="link link-hover text-xl font-bold">{name}</a
              >

              <img
                src="https://github.com/modrinth/art/blob/main/Branding/Mark/mark-dark__32x32.png?raw=true"
                width="24"
              />
            </div>
            <div class="" />
          </div>
        </div>
      </div>
    </div>
  {:else if platform == "gh"}
    <div class="flex justify-between place-items-center">
      <div class="flex space-x-3">
        <div>
          <div class="flex space-x-1">
            <a
              href="https://github.com/{id}"
              target="_blank"
              class="link link-hover text-xl font-bold">{name}</a
            >
            <div class="flex space-x-1.5 place-items-end">
              <div class="flex space-x-1">
                <p>by</p>
                <a
                  href="https://github.com/{author}"
                  target="_blank"
                  class="link link-hover">{author}</a
                >
              </div>
              <img src="https://github.com/favicon.ico" width="24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else if platform == "cx"}
    <div class="flex justify-between place-items-center">
      <div class="flex space-x-3">
        <div>
          <div class="flex space-x-1">
            {#if name == "Geyser" || name == "Floodgate"}
              <p class="text-xl font-bold">{name}</p>
              <div class=" flex space-x-1 place-items-end">
                <p>by</p>
                <a
                  href="https://geysermc.org"
                  target="_blank"
                  class="link link-hover">GeyserMC</a
                >
              </div>
            {:else}
              <p class="text-xl font-bold">{name}</p>
              <div class=" flex space-x-1 place-items-end" />
            {/if}
            <div class="flex space-x-1.5 place-items-end">
              <img
                src="https://arthmc.xyz/favicon.png"
                width="24"
                class="ml-0.5 mb-0.5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  {desc}
</div>
