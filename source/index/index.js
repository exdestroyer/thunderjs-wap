// require('../lib/login.js')
// import VueResource from "vue-resource";
//import TD from 'thunderjs'
import '../styles/scss/index.scss'
import Util from '../lib/util.js';
import store from '../vuex/store.js'
import Counter from '../components/Counter.vue'
 // import Vuex from 'vuex'
 // import $ from '$'
// const Vuex = require('vuex').default

// import '../lib/login.js';
// import '../lib/share.js'ddddd3333

// Vue.use(VueResource);
// console.log(TD)
// console.log(Vuex)
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
		console.log($('body'))
		console.log(Vuex)
		setTimeout(function(){
			console.log(Vuex)
		}, 3000)
		
	},
	methods: {

	}
});

