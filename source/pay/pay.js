// require('../lib/login.js')
import VueResource from "vue-resource";

import Util from '../lib/util.js';
import '../lib/login.js';
import '../lib/share.js'
console.log(Util.haslogin())
$('.sell-lnk').click(function function_name (argument) {

	if (!Util.haslogin()) {
		Util.login()
	} else {

	}
	
})

