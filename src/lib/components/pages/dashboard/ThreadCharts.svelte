<script lang="ts">
    import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
    import { onMount } from 'svelte';
    export let performance = [];

    // Register the required components
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

    let chartLabels = [];
    let chartCanvases = [];

    onMount(async () => {
    console.log(performance);

    let chartLabelsTemp = [];

    for (let i = 0; i < 60; i++) {
        if (i % 1 === 0) {
            chartLabelsTemp.push("");
        }
    }
    chartLabels = chartLabelsTemp;

    // Create a chart for each thread
    performance[0].threads.forEach((_, threadIndex) => {
        let threadValues = [];
        performance.forEach(perf => {
            threadValues.push(perf.threads[threadIndex].cpuUsage);
        });

        // Create a parent container div
        let container = document.createElement('div');
        container.classList.add('chart-container');
        container.classList.add('relative'); // Establishes a positioning context
        container.classList.add('w-[13rem]');

        // Create the canvas element
        let canvas = document.createElement('canvas');
        canvas.classList.add('chart-item');
        canvas.classList.add('bg-gradient-to-t');
        canvas.classList.add('from-[#152036]');
        canvas.classList.add('to-[#152436]');
        canvas.classList.add('rounded-xl');
        canvas.classList.add('shadow-lg');
        canvas.classList.add('p-2');

        // Create the text element
        let text = document.createElement('p');
        text.classList.add('text-white');
        text.classList.add('text-center');
        text.classList.add('font-bold');
        text.classList.add('text-lg');
        text.classList.add('absolute');
        text.classList.add('top-2'); // Adjust as needed
        text.classList.add('left-3'); // Adjust as needed
        text.innerHTML = `Thread ${threadIndex}`;

        //another piece of text saying the most recent cpuUsage value
        let text2 = document.createElement('p');
     
        text2.classList.add('text-center');

     
        text2.classList.add('absolute');
        text2.classList.add('top-2'); // Adjust as needed
        text2.classList.add('right-3'); // Adjust as needed
        text2.innerHTML = `${threadValues[threadValues.length - 1]}%`;


        // Append the canvas and text to the container
        container.appendChild(canvas);
        container.appendChild(text);
        container.appendChild(text2);

        // Append the container to the chartsContainer
        chartCanvases.push(container);
        document.getElementById('chartsContainer').appendChild(container);

        let ctx = canvas.getContext('2d');
        new Chart(ctx, {
    type: 'line',
    data: {
        labels: chartLabels,
        datasets: [{
            label: `Thread ${threadIndex}`,
            backgroundColor: '#088385',
            borderColor: '#088385',
            data: threadValues,
            fill: false,
            borderWidth: 3,
            pointRadius: 0, 
            hitRadius: 0, 
        }]
    },
    options: {
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    display: false,
                    font: {
                        size: 16
                    }
                },
                
            },
            x: {
                ticks: {
                    display: false,
                    font: {
                        size: 16
                    },
                  
                },
                grid: {
                    display: false, // Hides the y-axis grid lines
                }
               
            }
        },
        aspectRatio: 1.2,
    }
});

        });
    });


</script>

<style>
    #chartsContainer {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
    }
   
</style>

<div id="chartsContainer" class=" rounded p-4 w-[17rem] h-auto"></div>
