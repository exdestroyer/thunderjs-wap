// import Vue from 'vue'
// import Vuex from 'vuex'
// import search from "./modules/search"
// import searchGroup from "./modules/searchGroup"
// import middlewares from './middlewares'

//const debug = process.env.NODE_ENV !== 'production'
// console.log(Vuex)

TD.use(Vuex)
//TD.config.debug = debug

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
  	increment: state => state.count++,
    decrement: state => state.count--
  }
})
