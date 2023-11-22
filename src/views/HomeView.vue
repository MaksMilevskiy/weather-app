<template>
    <main class="wrapper">
        <div class="row">
            <CitySearch @addCity="addCityCard" />
        </div>

        <WeatherCardList
            :citiesList="citiesList"
            isAvailableDelete="true"
            @deleteCity="(city) => openDeleteCityModal(city)"
        />

        <Teleport to="#modal">
            <CustomModal
                v-if="openedModalType"
                :isModalOpen="openedModalType"
                @closeModal="toggleModalValue(null)"
            >
                <template v-if="openedModalType === 'limitExceeded'">
                    {{ $t('labels.cityLimitExceeded') }}
                </template>

                <template v-else-if="openedModalType === 'confirmDelete'">
                    <span>
                        {{$t('labels.areYouSureDeleteCity', [`${getCityLocalName(cityToDelete, $i18n.locale)}`])}}
                    </span>
                    <button class="modal-button" @click="deleteCityCard(cityToDelete)">
                        {{ $t('labels.delete') }}
                    </button>
                </template>

                <template v-else-if="openedModalType === 'cityAlreadyAdded'">
                    {{ $t('labels.cityLimitExceeded') }}
                </template>
            </CustomModal>
        </Teleport>
    </main>
</template>

<script setup>
import { Teleport, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import fetchCityFromCoords from '@/utils/fetchCityFromCoords';
import fetchUserIpData from '@/utils/fetchUserIpData';
import getCityLocalName from '@/utils/helpers/getCityLocalName';
import CitySearch from '@/components/CitySearch.vue';
import CustomModal from '@/components/CustomModal.vue';
import WeatherCardList from '@/components/WeatherCardList.vue';

const { locale } = useI18n();
const citiesList = ref([]);
const cityToDelete = ref(null);
const openedModalType = ref(null); // 'limitExceeded', 'confirmDelete', 'cityAlreadyAdded'

const toggleModalValue = (value) => {
    openedModalType.value = value;
};

const openDeleteCityModal = (cityInfo) => {
    toggleModalValue('confirmDelete');
    cityToDelete.value = cityInfo;
};
// Could've used lodash to make it more "right way", but we don't need that level of complexity here
const isSimilarCity = (firstCity, secondCity) => {
    return (
        firstCity.name == secondCity.name &&
        firstCity.country == secondCity.country &&
        firstCity.state == secondCity.state
    );
};

const addCityCard = (cityInfo) => {
    if (citiesList.value.length >= 5) {
        toggleModalValue('limitExceeded');
        return;
    }

    const similarCity = citiesList.value.find((city) => isSimilarCity(city, cityInfo));
    if (similarCity) {
        toggleModalValue('cityAlreadyAdded');
        return;
    }
    citiesList.value.push(cityInfo);
};

const deleteCityCard = (cityInfo) => {
    citiesList.value = citiesList.value.filter((city) => {
        return !isSimilarCity(city, cityInfo);
    });
    toggleModalValue(null);
};

onMounted(async () => {
    const ipData = await fetchUserIpData();
    const lat = ipData.loc.split(',')[0];
    const lon = ipData.loc.split(',')[1];

    const userCity = await fetchCityFromCoords(lat, lon, locale.value);
    addCityCard(userCity);
});
</script>

<style lang="scss" scoped>
.wrapper {
    padding: 2rem 0;

    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.modal-button {
    padding: 10px 20px;
    margin: 10px 5px 0;

    display: block;

    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #3498db;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: darken(#3498db, 10%);
    }
}
</style>
