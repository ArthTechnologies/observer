<div
  class="w-[3.75rem] h-[3.75rem] rounded-lg bg-gray-800 skeleton max-md:hidden"
/>
<div class="-mt-1">
  <div class="w-24 h-5 rounded bg-gray-800 skeleton" />
  <div class="w-12 h-3 rounded bg-gray-800 skeleton my-1 max-md:hidden" />
  <div class="flex gap-2 max-md:hidden">
    <div class="w-[3.75rem] h-2 rounded bg-gray-800 skeleton" />
    <p class="bg-gray-800 px-1.5 rounded text-xs skeleton"></p>
  </div>
</div>

<style>
  .primaryGradientStroke {
    position: relative;

    z-index: 1;
  }

  .primaryGradientStroke::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 2.5px; /* Space between button and border */
    background: linear-gradient(0deg, #135664, #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }

  .neutralGradientStroke {
    position: relative;

    z-index: 1;
  }

  .neutralGradientStroke:hover::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 2.5px; /* Space between button and border */
    background: linear-gradient(0deg, #2a354e, #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }
</style>
