<template>
    <div class="wrapper">
        <header class="header">
            <div class="header__group">
                <RouterLink to="/">{{ $t('labels.home') }}</RouterLink>
                <RouterLink to="/selected">{{ $t('labels.favourites') }}</RouterLink>
            </div>
            <div class="header__group">
                <img src="../src/assets/icons/app-logo.png" alt="Sun and clouds" />
            </div>
            <div class="header__group">
                <LocaleChanger @changeLocale="(newLocale) => {locale = newLocale}" />
            </div>
        </header>

        <RouterView />
    </div>
</template>

<script setup>
import { ref, provide, onMounted, watch } from 'vue';
import { RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LocaleChanger from '@/components/LocaleChanger.vue';

const { locale } = useI18n();
const favourites = ref({});
const updateFavourites = (value) => {
    favourites.value = value;
};

onMounted(() => {
    const favItems = localStorage.getItem('favourites');
    const currentLocale = localStorage.getItem('locale');
    if (favItems != 'undefined') {
        favourites.value = JSON.parse(favItems);
    }
    if (currentLocale != 'undefined') {
        locale.value = JSON.parse(currentLocale);
    }
    provide('favourites', { favourites, updateFavourites });
});
// for some reason it doesn't work on "onBeforeUnmount" hook (because page reload isn't counted as "unmount"),
// and onDestroy hook is not available in vue3
window.addEventListener('beforeunload', () => {
    localStorage.setItem('favourites', JSON.stringify(favourites.value));
    localStorage.setItem('locale', JSON.stringify(locale.value));
});
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

    max-width: 1200px;
    min-width: 360px;
    width: 100%;
    // to reduce CLS
    min-height: 80vh;
    margin: auto;

    box-shadow: 0 1px 5px rgba(52, 152, 219, 0.2);
}

.header {
    display: flex;
    justify-content: space-between;

    width: 100%;

    box-shadow: 0 1px 5px rgba(52, 152, 219, 0.2);

    &__group {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 0.5rem 1rem;

        @media (max-width: 480px) {
            flex-direction: column;
            align-items: center;
        }
    }

    .header__group:first-child {
        padding: 0;
    }

    a {
        height: 100%;
        padding: 0.5rem 1rem;

        box-shadow: 0 1px 5px rgba(52, 152, 219, 0.2);
        color: #3498db;
        font-size: 24px;
        line-height: 200%;
        text-decoration: none;

        transition: all 0.5s ease-in-out;

        &:hover {
            background-color: rgba(52, 152, 219, 0.2);
        }

        @media (max-width: 480px) {
            width: 100%;
            text-align: center;
        }
    }

    img {
        height: 50px;
        width: auto;
    }
}
</style>
