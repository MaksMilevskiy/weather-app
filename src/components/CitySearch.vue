<template>
    <div class="city-search">
        <div class="city-search__row">
            <input
                type="text"
                id="search"
                ref="cityInput"
                autocomplete="off"
                :placeholder="$t('labels.typeNameOfCity')"
                v-model="cityName"
                @input="searchCities"
            />
            <ul class="city-search__autocomplete-list" v-if="isVisibleDropdown">
                <template v-if="autocompletedCities.length">
                    <li
                        v-for="city in autocompletedCities"
                        :key="city"
                        @click="selectCity(city)"
                        class="city-search__autocomplete-city"
                    >
                        {{ getCityLocalName(city, $i18n.locale) }} {{ city.country }}
                        {{ city.state }}
                    </li>
                </template>
                <template v-else>
                    <div class="loading-spinner__wrapper">
                        <LoadingSpinner />
                    </div>
                </template>
            </ul>
            <button @click="addCityCard">
                <IconAdd />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import fetchCitiesAutocomplete from '@/utils/fetchCitiesAutocomplete';
import getCityLocalName from '@/utils/helpers/getCityLocalName';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import IconAdd from '@/components/icons/IconAdd.vue'

const emit = defineEmits(['addCity']);

const cityInput = ref();
const cityName = ref('');
const selectedCityFullObject = ref();
const isVisibleDropdown = ref(false);
const autocompletedCities = ref([]);

const searchCities = async () => {
    toggleDropdown(true);
    if (!cityName.value) {
        toggleDropdown(false);
        return;
    }
    autocompletedCities.value = await fetchCitiesAutocomplete(cityName.value);
    if (!autocompletedCities.value.length) {
        toggleDropdown(false);
    }
};
const toggleDropdown = (state) => {
    isVisibleDropdown.value = state;
};
const selectCity = (city) => {
    cityName.value = city.name;
    selectedCityFullObject.value = city;
    toggleDropdown(false);
};
const addCityCard = () => {
    if (!cityName.value) {
        return;
    }
    emit('addCity', selectedCityFullObject.value);
    cityName.value = '';
    selectedCityFullObject.value = null;
};

onClickOutside(cityInput, () => toggleDropdown(false)); // can't use native onBlur for input because it overrides custom select dropdown event
</script>

<style lang="scss" scoped>
.city-search {
    position: relative;
    max-width: 400px;
    margin: 0 auto;

    &__label {
        display: block;
        margin-bottom: 8px;

        text-align: center;
        font-size: 14px;
        color: #333;
    }

    &__row {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        border-radius: 25px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        background: #fff;
    }

    input[type='text'] {
        flex-grow: 1;
        border: none;
        padding: 10px 45px 10px 20px;
        font-size: 16px;
        border-radius: 25px;
        outline: none;

        &::placeholder {
            color: #aaa;
        }
    }

    &__autocomplete-list {
        border-radius: 0 0 4px 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background-color: #f9f9f9;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 10;
        margin-top: 2px;
        max-height: 200px;
        overflow-y: auto;

        li {
            padding: 10px 20px;
            cursor: pointer;
            &:hover {
                background-color: #e8f4ff;
            }
        }
    }

    button {
        position: absolute;
        right: 7px;
        top: 5px;
        width: 30px;
        height: 30px;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0;

        border: none;
        border-radius: 25px;
        background-color: transparent;
        color: #fff;
        cursor: pointer;
        outline: none;
    }

    .loading-spinner__wrapper {
        padding: 15px;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
