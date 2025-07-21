<script lang="ts">
    import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
    import { onMount } from 'svelte';
    export let performance = [];
    export let type = 1;

    // Register the required components
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

    let chartLabels = Array(60).fill("");
    let cpuPercent = 0;
    onMount(() => {
        console.log(performance);

        // Extract CPU usage data for thread 0
        let threadValues = performance.map(perf => perf.cpu/4);
  
      

  

        // Create a parent container div
        let container = document.createElement('div');
        if(type == 1) {
            container.classList.add('chart-container', 'relative', 'w-[13rem]');
        } else {
            container.classList.add('chart-container', 'relative', 'w-[10rem]');
        }

        // Create the canvas element
        let canvas = document.createElement('canvas');
        canvas.classList.add('chart-item', 'bg-gradient-to-t', 'from-[#152036]', 'to-[#152436]', 'rounded-xl', 'shadow-lg', 'p-2');

        // Create the text element for thread label
        let text = document.createElement('p');
               text.classList.add('text-center', 'absolute', 'top-1.5', 'left-4' ,'font-mono', 'text-gray-200');
      
        text.innerHTML = `CPU`;
        // Create the text element for the most recent CPU usage value
        let text2 = document.createElement('p');
        text2.classList.add('text-center', 'absolute', 'top-1.5', 'right-5' ,'font-mono');
        text2.innerHTML = `${(threadValues[threadValues.length - 1]).toFixed(2)}%`;

                //append a bar at the top behind the text that bulurs whats behind it.
                let bar = document.createElement('div');
        bar.classList.add('absolute', 'top-0', 'left-0', 'w-[92%]', 'h-12', 'bg-gradient-to-t', 'from-[#142134]', 'to-[#152436]' ,'rounded-t-xl');
        bar.style.opacity = '0.6';
        bar.style.filter = 'blur(3px)';
        container.appendChild(bar);

        // Append the canvas and text elements to the container
        container.appendChild(canvas);
        container.appendChild(text);
        container.appendChild(text2);

        // Append the container to the chartsContainer
        document.getElementById('chartsContainer').appendChild(container);

        // Initialize the chart
        let ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Thread 0',
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
                        }
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
                aspectRatio: 1.7,
            }
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

<div id="chartsContainer" class="rounded pr-4 w-[17rem] h-auto"></div>
