import './assets/base.css';

import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import UK from './locale/uk-UA.json'
import EN from './locale/en-US.json'
import App from './App.vue';
import router from './router';

const i18n = createI18n({
    legacy: false,
    locale: 'uk',
    fallbackLocale: 'en',
    messages: {
        'uk': UK,
        'en': EN
    }
});
i18n.global.locale.value = 'uk'

const app = createApp(App);

app.use(i18n);
app.use(router);
app.mount('#app');
