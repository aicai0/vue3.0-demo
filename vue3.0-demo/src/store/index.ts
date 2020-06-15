import Vue from 'vue'
import Vuex from 'vuex'

import moduleState from '@/store/constant'
import mutation from '@/store/mutation'
import actions, { moduleGetters } from '@/store/action'

Vue.use(Vuex)
type State = typeof moduleState;
export default new Vuex.Store({
  state: moduleState,
  mutations: mutation,
  actions,
  getters: moduleGetters
})
