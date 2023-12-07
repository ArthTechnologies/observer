import Alert from "$lib/components/ui/Alert.svelte";

export function numShort(num: number) {

  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}k`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(2)}m`;
  return `${(num / 1000000000).toFixed(3)}b`;
}

export function fileSizeShort(bytes: number) {

  if (bytes < 100) return bytes.toString();
  if (bytes < 100000) return `${(bytes / 1000).toFixed(1)}kB`;
  if (bytes < 100000000) return `${(bytes / 1000000).toFixed(1)}mB`;
  return `${(bytes / 100000000).toFixed(1)}gB`;
}

export function downloadProgressShort(currentBytes: number, totalBytes: number) {

  let unit = 'B';
  let unitDivisor = 1;  
  let current:any = currentBytes;
  let total:any = totalBytes;

  if (total < Math.pow(1024, 3) * 100) { // For gigabytes (GB)
    unit = 'gB';
    unitDivisor = Math.pow(1024, 3);
}
if (total < Math.pow(1024, 2) * 100) { // For megabytes (MB)
    unit = 'mB';
    unitDivisor = Math.pow(1024, 2);
}
if (total < 1024 * 100) { // For kilobytes (kB)
    unit = 'kB';
    unitDivisor = 1024;
}

  console.error("total = " + total + ", shortened = " + (total / unitDivisor).toFixed(1) + unit);

  total = (total / unitDivisor).toFixed(1);
  current = (current / unitDivisor).toFixed(1);

  return `${current}/${total}${unit}`;


}

export function handleDesc(desc: string) {
  let newDesc = desc;
        //change youtube.com to youtube-nocookie.com
        newDesc = newDesc.replaceAll(
          "https://www.youtube.com/embed",
          "https://www.youtube-nocookie.com/embed"
        );
        newDesc = newDesc.replaceAll("http://", "https://");

      //change the width of youtube videos to fit the screen
      let width = document.getElementById("body").offsetWidth;
      let divideAmount = 1.87;
      if (window.innerWidth < 768) divideAmount = 1.8;
      let newDimensions = 'class="w-full" style="height: '+(Math.round(width / divideAmount))+'px;"';
      newDesc = newDesc.replaceAll(
        'height: 150px',
        'height: ' + (width / 1.77) + 'px'
      );
      newDesc = newDesc.replaceAll(
        'height="358" width="638"',
        newDimensions
      );
      newDesc = newDesc.replaceAll(
        'height="360" width="640"',
        newDimensions
      );
        //make all links open in a new tab
        newDesc = newDesc.replaceAll(
          "href=",
          'target="_blank" rel="noreferrer" href='
        );
  return newDesc;
}

export function alert(msg: string, type: string = "error") {

  let alert = new Alert({
    target: document.body,
    props: {

      type: type,
      msg: msg,
    },
  });
  //4.5 seconds for showing the alert, 2 seconds for the fade animation
  setTimeout(() => {
    alert.$destroy();

  }, 6500);
}