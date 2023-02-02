<script lang="ts">
  export let name;
  export let id;
  export let platform;
  let author;
  if (platform == "lr") {
    //GET https://api.modrinth.com/v2/project/Lu3KuzdV, store author
    fetch("https://api.modrinth.com/v2/project/" + id)
      .then((response) => response.json())
      .then((data) => {
        author = data.author;
      });
  } else if (platform == "gh") {
    author = id.split("/")[0];
  }
</script>

{#if platform == "lr"}
  <div class="bg-base-200 rounded-lg p-3">
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
  </div>
{:else if platform == "gh"}
  <div class="bg-base-200 rounded-lg p-3">
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
  </div>
{/if}
