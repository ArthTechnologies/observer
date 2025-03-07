<script lang="ts">
    import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
    import { onMount } from 'svelte';
    export let performance = [];

    // Register the required components
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

    let chartLabels = Array(60).fill("");
    let total;
    onMount(() => {
        console.log(performance);

        // Extract CPU usage data for thread 0
        let threadValues = performance.map(perf => perf.memory.used);
        total = performance[0].memory.total;
        console.log(threadValues);

        // Create a parent container div
        let container = document.createElement('div');
        container.classList.add('chart-container', 'relative', 'w-[13rem]');

        // Create the canvas element
        let canvas = document.createElement('canvas');
        canvas.classList.add('chart-item', 'bg-gradient-to-t', 'from-[#152036]', 'to-[#362f20]', 'rounded-xl', 'shadow-lg', 'p-2');

        // Create the text element for thread label
        let text = document.createElement('p');
        text.classList.add('text-white', 'text-center', 'font-bold', 'text-lg', 'absolute', 'top-2', 'left-3');
        text.innerHTML = 'Memory';

        // Create the text element for the most recent CPU usage value
        let text2 = document.createElement('p');
        text2.classList.add('text-center', 'absolute', 'top-2', 'right-3');
        text2.innerHTML = `${(threadValues[threadValues.length - 1]/1024).toFixed(1)}GB`;

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
                    backgroundColor: '#f56922',
                    borderColor: '#f56922',
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
                        max: total,
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
</script>

<style>
    #chartsContainer {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
    }
</style>

<div id="chartsContainer" class="rounded p-4 w-[17rem] h-auto"></div>
