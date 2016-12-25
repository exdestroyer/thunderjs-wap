// require('../lib/login.js')
// import VueResource from "vue-resource";
//import TD from 'thunderjs'
import '../styles/css/index.css'
import Util from '../lib/util.js';
import store from '../vuex/store.js'
import Counter from '../components/Counter.vue'
// import '../lib/login.js';
// import '../lib/share.js'

// Vue.use(VueResource);
TD.use(Vuex)
const tm = new TD({
	el: '#thunder-wrap',
	store,
	components: {
		Counter
	},
	data: {
		isShow: true,
	},
	computed: {

	},
	mounted: function() {
		console.log('mounted')
	},
	methods: {

	}
});

