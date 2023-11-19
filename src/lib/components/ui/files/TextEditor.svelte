<script>
  import { browser } from "$app/environment";
  let origionalText = "";

  function getOrigionalText() {
    if (browser) {
      if (document.getElementById("textEditor") != null) {
        origionalText = document.getElementById("textEditor").value;
      }
    }
  }

  function saveIndicator() {
    if (document.getElementById("textEditor") != null) {
      if (document.getElementById("textEditor").value == origionalText) {
        document.getElementById("filename").innerHTML = document
          .getElementById("filename")
          .innerHTML.replace("*", "");
        document.getElementById("saveButton").classList.add("btn-disabled");
      } else {
        //the * indicates it needs to be saved
        if (!document.getElementById("filename").innerHTML.endsWith("*")) {
          document.getElementById("filename").innerHTML += "*";
        }

        //remove btn-disabled from save button
        document.getElementById("saveButton").classList.remove("btn-disabled");
      }
    }
  }

  if (browser) {
    //event listener for 'updatedTextEditor' event
    document.addEventListener("updatedTextEditor", function (e) {
      getOrigionalText();
    });
  }
</script>

<textarea
  on:input={saveIndicator}
  class="textarea w-full bg-base-200"
  id="textEditor"
/>

<style>
  textarea {
    resize: none;
    height: 90%;
  }
</style>
