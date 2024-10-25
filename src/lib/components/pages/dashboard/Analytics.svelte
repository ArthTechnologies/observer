<script>
  import { browser } from "$app/environment";

  //get the top 10 posts
  let hits = [];
  let platforms = [];
  let res = {};
  let x1 = [
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
    170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300,
  ];
  let y1 = [];

  let y2 = [];
  let points = "";
  let points2 = "";
  let linux;
  let windows;
  let macos;
  let android;
  let ios;
  let unknown;

  let languages = [];
  let referrers = [];
  let pages = [];
  let promise;

  let getStartedButtonClicks;
  if (browser) {
    promise = fetch("https://backend.arthmc.xyz/analytics")
      .then((response) => response.json())
      .then((json) => {
        res = json;
        console.log(json);
        hits = json.hits;
        platforms = json.devices;
        let langsTemp = [];
        //get the top 12 languages
        for (let i = 0; i < 9; i++) {
          let lang = {
            name: Object.keys(json.languages)[i],
            hits: json.languages[Object.keys(json.languages)[i]],
          };
          console.log(lang);
          langsTemp.push(lang);
        }
        //sort the languages by hits
        languages = langsTemp.sort((a, b) => b.hits - a.hits);
        console.log(languages);

        //move data to appear as columns,
        //as there is a visual bug with the grid on column mode
        languages = [
          languages[0],
          languages[4],
          languages[1],
          languages[5],
          languages[2],
          languages[6],
          languages[3],
          languages[7],
        ];

        let refTemp = [];
        //get the top 12 referrers
        for (let i = 0; i < 9; i++) {
          let ref = {
            name: Object.keys(json.referrers)[i],
            hits: json.referrers[Object.keys(json.referrers)[i]],
          };
          refTemp.push(ref);
        }
        //sort the referrers by hits
        referrers = refTemp.sort((a, b) => b.hits - a.hits);

        //move data to appear as columns,
        //as there is a visual bug with the grid on column mode
        referrers = [
          referrers[0],
          referrers[4],
          referrers[1],
          referrers[5],
          referrers[2],
          referrers[6],
          referrers[3],
          referrers[7],
        ];

        let pageTemp = [];
        //get the top 12 pages
        for (let i = 0; i < 9; i++) {
          let page = {
            name: Object.keys(json.pages)[i],
            hits: json.pages[Object.keys(json.pages)[i]],
          };
          pageTemp.push(page);
        }
        //sort the pages by hits
        pages = pageTemp.sort((a, b) => b.hits - a.hits);

        //move data to appear as columns,
        //as there is a visual bug with the grid on column mode
        pages = [
          pages[0],
          pages[4],
          pages[1],
          pages[5],
          pages[2],
          pages[6],
          pages[3],
          pages[7],
        ];

        for (let i = res.day - 30; i <= res.day; i++) {
          if (res.days[i] == undefined) {
            y1.push(100);
            y2.push(100);
          } else {
            let bpageredirects = 0;
            if (res.days[i].redirectsB != undefined) {
              bpageredirects = res.days[i].redirectsB;
            }
            y1.push(100 - (100 / res.max) * res.days[i].hits);
            y2.push(
              100 - (100 / res.max) * (res.days[i].redirects + bpageredirects),
            );
          }
        }
        for (let i = 0; i <= 30; i++) {
          points += `${x1[i]},${y1[i]} `;
          points2 += `${x1[i]},${y2[i]} `;
        }

        linux = res.devices.linux;
        windows = res.devices.windows;
        macos = res.devices.macintosh;
        android = res.devices.android;
        ios = res.devices.iOS;
        unknown = res.devices.unknown;

        getStartedButtonClicks = res.getStartedButtonClicks;
      });
  }
</script>

<div class="w-[22rem] md:w-[25rem]">
  <div class="flex items-center flex-col">
    <p class="text-lg font-bold my-3 ml-8">Hits in the last 30 days</p>
    <div class="bg-base-200 rounded-xl shadow mb-5">
      <svg width="300" height="100">
        <g class="x" transform="translate(0,120)">
          <text x="0">30</text>
          <text x="60">24</text>
          <text x="120">18</text>
          <text x="180">12</text>
          <text x="240">6</text>
          <text x="300">Today</text>
        </g>

        <!-- y axis -->
        <line
          x1="0"
          x2="0"
          y1="0"
          y2="100"
          style="stroke: #000000; stroke-width: 2"
        />
        <g class="y" transform="translate(-10,0)">
          <text y="100">0</text>
          <text y="50">{res.max / 2}</text>
          <text y="0">{res.max}</text>
        </g>

        <!-- data -->
        <polyline
          style="stroke: #f8844e; stroke-width: 2"
          points="
    {points2}
  "
        />
        <polyline
          style="stroke: #00a4cd; stroke-width: 2"
          points="
        {points}
      "
        />
        <!-- x axis -->
        <line
          style="stroke: #000000; stroke-width: 2"
          x1="0"
          x2="300"
          y1="100"
          y2="100"
        />
      </svg>
    </div>
  </div>

  <div class="flex flex-col items-center pb-36">
    <p class="text-lg font-bold mt-3 ml-8 mb-3">Hits by platform</p>
    <div
      class="bg-base-200 w-[24.75rem] rounded-xl shadow p-5 flex justify-between mb-3"
    >
      <p class="text-left">Windows: {windows}</p>
      <p class="text-center">{Math.round((windows / res.hits) * 100)}%</p>
    </div>
    <div
      class="bg-base-200 w-[24.75rem] rounded-xl shadow p-5 flex justify-between mb-3"
    >
      <p class="text-left">Linux: {linux}</p>
      <p class="text-center">{Math.round((linux / res.hits) * 100)}%</p>
    </div>
    <div
      class="bg-base-200 w-[24.75rem] rounded-xl shadow p-5 flex justify-between mb-3"
    >
      <p class="text-left">Mac: {macos}</p>
      <p class="text-center">{Math.round((macos / res.hits) * 100)}%</p>
    </div>
    <div
      class="bg-base-200 w-[24.75rem] rounded-xl shadow p-5 flex justify-between mb-3"
    >
      <p class="text-left">iOS: {ios}</p>
      <p class="text-center">{Math.round((ios / res.hits) * 100)}%</p>
    </div>
    <div
      class="bg-base-200 w-[24.75rem] rounded-xl shadow p-5 flex justify-between mb-3"
    >
      <p class="text-left">Android: {android}</p>
      <p class="text-center">{Math.round((android / res.hits) * 100)}%</p>
    </div>
    <div
      class="bg-base-200 w-[24.75rem] rounded-xl shadow p-5 flex justify-between mb-3"
    >
      <p class="text-left">Unknown: {unknown}</p>
      <p class="text-center">{Math.round((unknown / res.hits) * 100)}%</p>
    </div>
    <p class="text-lg font-bold mt-3 ml-8 mb-3">Hits by language</p>
    <div class="grid grid-rows-2 grid-flow-col gap-4 w-[24.75rem]">
      {#await promise then}
        {#each languages as language, index}
          {#if language.hits != null}
            <div
              class="bg-base-200 h-16 rounded-xl shadow p-2 pl-2.5 justify-between mb-3 text-sm"
            >
              <p class="mt-1">
                <span class="font-bold uppercase">{language.name}:</span>
                {Math.round((language.hits / res.initial) * 100)}%
              </p>
              <p>{language.hits} Hits</p>
            </div>
          {/if}
        {/each}
      {/await}
    </div>

    <p class="text-lg font-bold mt-3 ml-8 mb-3">Hits by referrer</p>
    <div class="grid grid-rows-2 grid-flow-col gap-4 w-[24.75rem]">
      {#await promise then}
        {#each referrers as referrer, index}
          {#if referrer.hits != null}
            <div
              class="bg-base-200 h-16 rounded-xl shadow p-2 pl-2.5 justify-between mb-3 text-sm"
            >
              <p class="mt-1">
                <span class="font-bold capitalize">{referrer.name}:</span>
                {Math.round((referrer.hits / res.initial) * 100)}%
              </p>
              <p>{referrer.hits} Hits</p>
            </div>
          {/if}
        {/each}
      {/await}
    </div>

    <p class="text-lg font-bold mt-3 ml-8 mb-3">Hits by page</p>
    <div class="grid grid-rows-2 grid-flow-col gap-4 w-[24.75rem]">
      {#await promise then}
        {#each pages as page, index}
          {#if page.hits != null}
            <div
              class="bg-base-200 h-16 rounded-xl shadow p-2 pl-2.5 justify-between mb-3 text-sm truncate text-ellipsis"
            >
              <p class="mt-1">
                <span class="font-bold"
                  >{#if page.name.split("/").length > 2}/{page.name
                      .split("/")[1]
                      .split("")[0]}/{page.name.split(
                      "/",
                    )[2]}{:else}{page.name}{/if}:</span
                >
                {Math.round((page.hits / res.initial) * 100)}%
              </p>
              <p>{page.hits} Hits</p>
            </div>
          {/if}
        {/each}
      {/await}
    </div>

    <div
      class="bg-base-200 w-[24.75rem] rounded-xl shadow p-4 flex justify-between mb-3 mt-8 h-12 text-sm"
    >
      <p class="text-left">
        "Get Started" Clicks: {getStartedButtonClicks}
      </p>
    </div>
    <div
      class="bg-base-200 w-[24.75rem] rounded-xl shadow p-4 flex justify-between mb-3 h-12 text-sm"
    >
      <p class="text-left">
        First Time Visitors: {res.initial}
      </p>
      <p class="text-center">{Math.round((res.initial / res.hits) * 100)}%</p>
    </div>
    <div
      class="bg-base-200 w-[24.75rem] rounded-xl shadow p-4 flex justify-between mb-3 h-12 text-sm"
    >
      <p class="text-left">
        Returning Visitors: {res.returning}
      </p>
      <p class="text-center">{Math.round((res.returning / res.hits) * 100)}%</p>
    </div>
  </div>
</div>

<style>
  svg {
    overflow: visible;
    margin: 3em;
  }

  line,
  polyline {
    fill: none;
    stroke: black;
  }

  .x text {
    text-anchor: middle;
  }

  .y text {
    text-anchor: end;
    dominant-baseline: middle;
  }
</style>
