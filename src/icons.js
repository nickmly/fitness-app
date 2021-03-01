import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faArrowAltCircleLeft, faTimesCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faPlus);
library.add(faArrowAltCircleLeft);
library.add(faTimesCircle);
library.add(faTimes);

Vue.component('font-awesome-icon', FontAwesomeIcon);