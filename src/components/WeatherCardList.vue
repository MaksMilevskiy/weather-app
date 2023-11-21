<template>
    <TransitionGroup
        v-if="citiesList"
        :key="reloadKey"
        tag="ul"
        name="weather-card-list"
        class="weather-card__list"
    >
        <WeatherCard
            v-for="(city, index) in citiesList"
            :key="index"
            :cityInfo="city"
            :isAvailableDelete="isAvailableDelete"
            @deleteCity="(value) => emit('deleteCity', value)"
        />
    </TransitionGroup>
</template>

<script setup>
import { watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import WeatherCard from '@/components/WeatherCard.vue';

const props = defineProps(['citiesList', 'isAvailableDelete']);
const emit = defineEmits(['deleteCity']);

const reloadKey = ref(0);
const { locale } = useI18n();

// to reload component on locale change
watch(locale, () => {
    reloadKey.value++;
});
</script>

<style lang="scss" scoped>
.weather-card {
    &__list {
        max-width: 1200px;

        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 2rem;

        @media (max-width: 480px) {
            gap: 1rem;
        }
    }
}
.weather-card-list-move,
.weather-card-list-enter-active,
.weather-card-list-leave-active {
    transition: all 1s ease;
}

.weather-card-list-enter-from,
.weather-card-list-leave-to {
    opacity: 0;
    position: absolute;
    transform: translateX(-50px);
}

.weather-card-list-leave-active {
    position: absolute;
}
</style>
