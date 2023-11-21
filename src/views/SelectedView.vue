<template>
    <TransitionGroup tag="main" name="selected-wrapper" class="selected__wrapper">
        <WeatherCardList
            v-if="citiesList.length"
            :citiesList="citiesList"
            :isAvailableDelete="false"
        />
        <div class="selected__empty" v-else>
            {{ $t('labels.favEmpty') }}
        </div>
    </TransitionGroup>
</template>

<script setup>
import { inject, onBeforeMount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import WeatherCardList from '@/components/WeatherCardList.vue';
import fetchCityFromCoords from '@/utils/fetchCityFromCoords';

const { favourites } = inject('favourites');

const citiesList = ref([]);
const { locale } = useI18n();

const setCitiesList = () => {
    citiesList.value = [];
    if (favourites.value) {
        Object.entries(favourites.value).forEach(async (cityData) => {
            const cityInfo = await fetchCityFromCoords(
                cityData[1].lat,
                cityData[1].lon,
                locale.value
            );
            citiesList.value.push(cityInfo);
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

.selected-wrapper-move,
.selected-wrapper-enter-active,
.selected-wrapper-leave-active {
    transition: all 1s ease;
}

.selected-wrapper-enter-from,
.selected-wrapper-leave-to {
    opacity: 0;
    position: absolute;
    transform: translateX(-50px);
}

.selected-wrapper-leave-active {
    position: absolute;
}
</style>
