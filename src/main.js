import './assets/css/weui.css'
import './assets/css/app.css'
import Vue from 'vue'
import App from './App'
import Http from 'vue-resource'
Vue.use(Http);
import router from './assets/js/router.js'
router.start(App, 'app');