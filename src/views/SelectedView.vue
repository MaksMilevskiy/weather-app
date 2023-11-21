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
import WeatherCardList from '@/components/WeatherCardList.vue';
import fetchCityFromCoords from '@/utils/fetchCityFromCoords';
import { inject, onBeforeMount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { favourites } = inject('favourites');

const citiesList = ref([]);
const { locale } = useI18n();

const setCitiesList = () => {
    citiesList.value = [];
    Object.entries(favourites.value).forEach(async (cityData) => {
        const cityInfo = await fetchCityFromCoords(cityData[1].lat, cityData[1].lon, locale.value);
        citiesList.value.push(cityInfo);
    });
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
