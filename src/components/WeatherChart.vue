<template>
    <div class="weather-chart__wrapper">
        <div class="weather-chart">
            <canvas ref="chartElement"></canvas>
        </div>
    </div>
</template>

<script setup>
import Chart from 'chart.js/auto';
import { ref, onMounted, watch, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

const dayLabels = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const props = defineProps(['dailyTemperature', 'isWeekMode', 'isNightTime', 'backgroundColor']);
const { dailyTemperature, isNightTime, isWeekMode } = toRefs(props);
const { t, locale } = useI18n();

const chartElement = ref(null);
const dayTimestamps = ref([]);
const nightTimestamps = ref([]);

let chart;
let chartData = {
    labels: [],
    data: []
};

const getDateFromTimestamp = (timeString) => {
    const dayNumber = new Date(timeString).getDay();
    const dayLabel = dayLabels[dayNumber - 1] || dayLabels[6];
    return t(`shortDays.${dayLabel}`);
};
const isDayTime = (hours) => {
    return hours >= 6 && hours < 21;
};
const calculateAverageTemp = (temps) => {
    const temp = temps.reduce((sum, val) => sum + val, 0) / temps.length;
    return Math.round(temp);
};

const setChartData = () => {
    let timestamps = [];

    if (isWeekMode.value) {
        timestamps = isNightTime.value === true ? nightTimestamps.value : dayTimestamps.value;
        chartData.labels = timestamps.map((timestamp) => timestamp.date);
        chartData.data = timestamps.map((timestamp) => timestamp.avgTemp);
    } else {
        timestamps = dailyTemperature.value;
        chartData.labels = timestamps.map(
            (timestamp) => `${new Date(timestamp.dt * 1000).getUTCHours()}:00`
        );
        chartData.data = timestamps.map((timestamp) => Math.round(timestamp.main.temp));
    }
};
const updateChart = () => {
    try {
        setChartData();
        chart.data.datasets = [
            {
                data: chartData.data,
                backgroundColor: '#2256e6'
            }
        ];
        chart.data.labels = chartData.labels;
        chart.update();
    } catch (err) {
        console.log(err);
    }
};
const setTimestamps = () => {
    try {
        dayTimestamps.value = [];
        nightTimestamps.value = [];

        let dayTemps = {};
        let nightTemps = {};

        dailyTemperature.value.forEach((timestamp) => {
            const date = getDateFromTimestamp(timestamp.dt_txt);
            const hour = new Date(timestamp.dt_txt).getHours();

            const tempArray = isDayTime(hour) ? dayTemps : nightTemps;
            if (!tempArray[date]) {
                tempArray[date] = [];
            }
            tempArray[date].push(timestamp.main.temp);
        });

        dayTimestamps.value = Object.keys(dayTemps).map((date) => ({
            date,
            avgTemp: calculateAverageTemp(dayTemps[date])
        }));
        nightTimestamps.value = Object.keys(nightTemps).map((date) => ({
            date,
            avgTemp: calculateAverageTemp(nightTemps[date])
        }));
    } catch (err) {
        console.log(err);
    }
};
const initChart = () => {
    try {
        setChartData();
        chart = new Chart(chartElement.value, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        data: chartData.data,
                        backgroundColor: '#2256e6'
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function (value) {
                                return value + '°C';
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.log(err);
        initChart();
    }
};

onMounted(() => {
    if (isWeekMode.value) {
        setTimestamps();
    }
    initChart();

    watch(dailyTemperature, (newVal, oldVal) => {
        if (newVal != oldVal) {
            if (isWeekMode.value) {
                setTimestamps();
            }
            if (chart) {
                updateChart();
            } else {
                initChart();
            }
        }
    });

    watch(isNightTime, (newVal, oldVal) => {
        if (newVal != oldVal) {
            if (chart) {
                updateChart();
            } else {
                initChart();
            }
        }
    });

    watch(locale, () => {
        if (chart) {
            updateChart();
        } else {
            initChart();
        }
    });
});
</script>

<style lang="scss" scoped>
.weather-chart {
    height: 150px;
    width: 100%;
}
</style>
