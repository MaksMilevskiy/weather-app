<template>
    <main class="selected__wrapper">
        <WeatherCardList
            v-if="citiesList.length"
            :citiesList="citiesList"
            :isAvailableDelete="false"
        />
        <div class="selected__empty" v-else>
            {{ $t('labels.favEmpty') }}
        </div>
    </main>
</template>

<script setup>
import { inject, onBeforeMount, ref, watch } from 'vue';
import WeatherCardList from '@/components/WeatherCardList.vue';
import fetchCitiesAutocomplete from '@/utils/fetchCitiesAutocomplete';

const { favourites } = inject('favourites');

const citiesList = ref([]);

const setCitiesList = () => {
    citiesList.value = [];
    if (favourites.value) {
        favourites.value.forEach(async (cityData) => {
            const cityValues = cityData.split('$');

            const name = cityValues[0] || '';
            const country = cityValues[1] || '';
            const state = cityValues[2] || '';

            const cityInfo = await fetchCitiesAutocomplete(name, state, country);
            citiesList.value.push(cityInfo[0]);
        });
    }
};

onBeforeMount(() => {
    setCitiesList();

    watch(
        favourites,
        () => {
            setCitiesList();
        },
        { deep: true }
    );
});
</script>

<style lang="scss">
.selected {
    &__wrapper {
        padding-top: 2rem;
    }
    &__empty {
        min-height: 80vh;

        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
