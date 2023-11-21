<template>
    <div class="locale-changer">
        <div
            class="locale-changer__img-wrapper"
            v-for="locale in $i18n.availableLocales"
            :key="`locale-${locale}`"
            @click="() => changeLocale(locale)"
        >
            <img :src="`https://hatscripts.github.io/circle-flags/flags/${COUNTRY_TO_LOCALE_NAMES[locale]}.svg`" :alt="`${locale} icon`" />
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import COUNTRY_TO_LOCALE_NAMES from '@/lib/constants/COUNTRY_TO_LOCALE_NAMES'

const emit = defineEmits(['changeLocale'])

const { locale } = useI18n();

const changeLocale = (newLocale) => {
    locale.value = newLocale;
    emit('changeLocale', locale.value)
};
</script>

<style lang="scss" scoped>
.locale-changer {
    display: flex;
    gap: 1rem;

    &__img-wrapper {
        border-radius: 50%;

        img {
            width: 30px;
            height: 30px;
            margin: auto;

            transition: all 0.5s ease;

            &:hover {
                cursor: pointer;

                transform: scale(1.1);
            }
        }
    }
}
</style>
