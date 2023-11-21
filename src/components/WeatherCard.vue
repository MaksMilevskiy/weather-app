<template>
    <li
        v-if="isDataLoaded"
        class="weather-card__wrapper"
        :class="isNightTimeMode ? 'night' : 'day'"
    >
        <div class="weather-card">
            <div class="weather-card__header">
                <div class="weather-card__city-name">
                    {{ getCityLocalName(cityInfo, $i18n.locale) }}
                </div>
                <div class="weather-card__actions">
                    <!-- <button
                        v-if="isFavourite"
                        class="icon-button icon-star-filled"
                        @click="removeFromFavourites"
                        :title="$t('labels.removeFromFav')"
                    ></button>
                    <button
                        v-else
                        class="icon-button icon-star"
                        @click="addToFavourites"
                        :title="$t('labels.addToFav')"
                    ></button> -->
                    <button
                        v-if="isAvailableDelete"
                        class="icon-button icon-trash"
                        @click="$emit('deleteCity', cityInfo)"
                        :title="$t('labels.deleteCity')"
                    ></button>
                </div>
            </div>

            <div class="weather-card__content">
                <div class="weather-card__temperature">
                    {{ isWeekMode ? $t('labels.average') : $t('labels.current') }}:
                    {{ roundedTemperature }}°
                </div>
                <div class="weather-card__description" v-if="!isWeekMode">
                    {{ weatherDescription }}
                </div>
            </div>

            <div class="weather-card__footer">
                <div class="toggle-switch__group">
                    <span>{{ $t('labels.dayWeek') }}</span>
                    <label class="toggle-switch">
                        <input type="checkbox" v-model="isWeekMode" />
                        <span class="toggle-switch__slider"></span>
                    </label>
                </div>
                <div class="toggle-switch__group" v-if="isWeekMode">
                    <span>{{ $t('labels.dayNight') }}</span>
                    <label class="toggle-switch">
                        <input type="checkbox" v-model="isNightTimeMode" />
                        <span class="toggle-switch__slider day-night"></span>
                    </label>
                </div>
            </div>
        </div>

        <WeatherChart
            v-if="dailyTemperature"
            :key="weatherChartKey"
            :dailyTemperature="dailyTemperature"
            :isWeekMode="isWeekMode"
            :isNightTime="isNightTimeMode"
        />
    </li>
    <LoadingSpinner v-else />
</template>

<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import WeatherChart from '@/components/WeatherChart.vue';
import fetchCurrentWeather from '@/utils/fetchCurrentWeather';
import fetchDailyWeather from '@/utils/fetchDailyWeather';
import getCityLocalName from '@/utils/helpers/getCityLocalName';

const props = defineProps(['cityInfo', 'isAvailableDelete']);
const emit = defineEmits(['deleteCity']);
const cityId = `city${props?.cityInfo?.lat?.toFixed(3) * 1000}.${
    props?.cityInfo?.lon?.toFixed(3) * 1000
}`;

const isDataLoaded = ref(false);
const temperature = ref();
const weatherDescription = ref('');
const dailyTemperature = ref(null);
const weeklyWeatherData = ref();
const isWeekMode = ref(false);
const isNightTimeMode = ref(false);
const weatherChartKey = ref(0);
const { locale } = useI18n();
// const { favourites, updateFavourites } = inject('favourites');

const roundedTemperature = computed(() => {
    return Math.round(temperature.value);
});

// const isFavourite = computed(() => {
//     if (favourites.value) {
//         return cityId in favourites.value;
//     }
//     return false
// });

const getAverageTemp = (tempArray) => {
    let temp = 0;
    tempArray.forEach((timestamp) => {
        temp += timestamp.main.temp;
    });
    return temp / tempArray.length;
};

const isDayTime = (hours) => {
    return hours >= 6 && hours < 18;
};

const setCurrentDaytime = () => {
    const date = new Date();
    const hours = date.getHours();

    isNightTimeMode.value = !isDayTime(hours)
};

const getDaytimeAverageTemperature = () => {
    try {
        let relevantTemps = weeklyWeatherData.value.filter((timestamp) => {
            const date = new Date(timestamp.dt_txt);
            const hour = date.getHours();
            const isDay = isDayTime(hour);
            return isNightTimeMode.value ? !isDay : isDay;
        });

        temperature.value = getAverageTemp(relevantTemps);
    } catch (err) {
        console.log(err);
    }
};

const getCurrentWeatherData = async (lat, lon) => {
    try {
        const currentWeatherData = await fetchCurrentWeather(lat, lon, locale.value);

        if (!isWeekMode.value) {
            temperature.value = currentWeatherData?.main?.temp;
        }
        weatherDescription.value = currentWeatherData?.weather[0]?.description;
    } catch (err) {
        console.log(err);
    }
};

const getDailyWeatherData = async (lat, lon) => {
    try {
        const dailyWeatherData = await fetchDailyWeather(lat, lon, isWeekMode.value, locale.value);

        if (isWeekMode.value) {
            weeklyWeatherData.value = dailyWeatherData.list;
            getDaytimeAverageTemperature();
        }
        dailyTemperature.value = dailyWeatherData.list;
    } catch (err) {
        console.log(err);
    }
};

const getWeather = async () => {
    isDataLoaded.value = false;
    getCurrentWeatherData(props.cityInfo.lat, props.cityInfo.lon);
    getDailyWeatherData(props.cityInfo.lat, props.cityInfo.lon);
    isDataLoaded.value = true;
};

// const addToFavourites = () => {
//     if (!favourites.value) {
//         favourites.value = {}
//     }
//     favourites.value[cityId] = { lat: props.cityInfo.lat, lon: props.cityInfo.lon };
//     updateFavourites(favourites.value);
// };

// const removeFromFavourites = () => {
//     delete favourites.value[cityId];
//     updateFavourites(favourites.value);
// };

onMounted(() => {
    setCurrentDaytime();
    getWeather();

    watch(
        isWeekMode,
        (newValue) => {
            getWeather();
            
            if (!newValue) {
                setCurrentDaytime();
            }
        },
        { deep: true }
    );

    watch(
        isNightTimeMode,
        () => {
            getDaytimeAverageTemperature();
        },
        { deep: true }
    );
});
</script>

<style lang="scss" scoped>
.weather-card {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__wrapper {
        max-width: 300px;
        width: 100%;

        margin: auto;
        border-radius: 8px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;

        &.day {
            background: -moz-linear-gradient(
                180deg,
                rgba(227, 253, 255, 1) 0%,
                rgba(255, 255, 207, 1) 100%
            );
            background: -webkit-linear-gradient(
                180deg,
                rgba(227, 253, 255, 1) 0%,
                rgba(255, 255, 207, 1) 100%
            );
            background: -o-linear-gradient(
                180deg,
                rgba(227, 253, 255, 1) 0%,
                rgba(255, 255, 207, 1) 100%
            );
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#FFFFCF', endColorstr='#E3FDFF', GradientType=1 );
            background: -ms-linear-gradient(
                180deg,
                rgba(227, 253, 255, 1) 0%,
                rgba(255, 255, 207, 1) 100%
            );
            background: linear-gradient(
                180deg,
                rgba(227, 253, 255, 1) 0%,
                rgba(255, 255, 207, 1) 100%
            );
        }
        &.night {
            background: -moz-linear-gradient(
                180deg,
                rgba(207, 213, 243, 1) 0%,
                rgba(227, 132, 255, 1) 99%
            );
            background: -webkit-linear-gradient(
                180deg,
                rgba(207, 213, 243, 1) 0%,
                rgba(227, 132, 255, 1) 99%
            );
            background: -o-linear-gradient(
                180deg,
                rgba(207, 213, 243, 1) 0%,
                rgba(227, 132, 255, 1) 99%
            );
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#E384FF', endColorstr='#CFD5F3', GradientType=1 );
            background: -ms-linear-gradient(
                180deg,
                rgba(207, 213, 243, 1) 0%,
                rgba(227, 132, 255, 1) 99%
            );
            background: linear-gradient(
                180deg,
                rgba(207, 213, 243, 1) 0%,
                rgba(227, 132, 255, 1) 99%
            );
            .weather-card__temperature {
                color: #000;
            }
        }
    }

    &__header {
        width: 100%;
        padding: 1rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__city-name {
        font-weight: bold;
        color: #333;
        font-size: 1.25rem;
    }

    &__actions {
        display: flex;
        gap: 10px;
        .icon-button {
            width: 20px;
            height: 20px;
            padding: 0;

            border: none;
            cursor: pointer;

            background-color: transparent;
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center;

            &:hover {
                color: #666;
            }
        }

        .icon-star {
            background-image: url('../assets/icons/star.png');
        }
        .icon-star:hover,
        .icon-star-filled {
            background-image: url('../assets/icons/star-filled.png');
        }
        .icon-trash {
            background-image: url('../assets/icons/trash.png');
        }
    }

    &__content {
        min-height: 80px;
        width: 100%;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;

        border-bottom: 1px solid #e7e7e7;
    }

    &__temperature {
        font-size: 1.3rem;
        font-weight: bold;
        color: #3498db;
    }

    &__description {
        text-transform: capitalize;
        font-size: 1.1rem;
        color: #3498db;
    }

    &__footer {
        width: 100%;
        padding: 0.5rem 1rem;

        display: flex;
        justify-content: space-between;
        gap: 15px;

        .toggle-switch {
            width: 50px;
            height: 26px;

            position: relative;
            display: inline-block;

            input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            &__group {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;

                span {
                    letter-spacing: 0.7px;
                }
            }

            &__slider {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;

                cursor: pointer;
                background-color: rgba(252, 238, 172, 0.8);
                transition: 0.4s;
                border-radius: 26px;

                &:before {
                    content: '';
                    position: absolute;

                    height: 22px;
                    width: 22px;
                    left: 2px;
                    bottom: 2px;

                    background: white url('../assets/icons/day.png');
                    background-size: 110%;
                    background-position: center;
                    background-repeat: no-repeat;
                    transition: 0.4s;
                    border-radius: 50%;
                }
            }

            &__slider.day-night {
                background-color: rgba(252, 238, 172, 0.8);
            }
            &__slider.day-night:before {
                background: white url('../assets/icons/sunny.png');
                background-size: 105%;
                background-position: center;
                background-repeat: no-repeat;
            }

            input:checked + .toggle-switch__slider.day-night {
                background-color: rgba(65, 16, 99, 0.5);
            }
            input:checked + .toggle-switch__slider.day-night:before {
                background: white url('../assets/icons/night.png');
                background-size: 105%;
                background-position: center;
                background-repeat: no-repeat;
            }

            input:checked + .toggle-switch__slider {
                background-color: rgba(65, 16, 99, 0.5);
            }

            input:checked + .toggle-switch__slider:before {
                transform: translateX(24px);
                background: white url('../assets/icons/week.png');
                background-size: 105%;
                background-position: center;
                background-repeat: no-repeat;
            }

            input:focus + .toggle-switch__slider {
                box-shadow: 0 0 1px #3498db;
            }
        }
    }
}
</style>
