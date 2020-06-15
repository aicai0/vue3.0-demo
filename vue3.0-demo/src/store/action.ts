import { ActionContext } from 'vuex'
import moduleState from '@/store/constant'
type State = typeof moduleState;
const moduleGetters = {}
type ReturnGetters<T extends {[key: string]: (...args: any) => any}> = {
    [P in keyof T]: ReturnType<T[P]>
};
type Getters = ReturnGetters<typeof moduleGetters>;
export {
  moduleGetters
}
export default {
  getData ({ commit }: ActionContext<State, Getters>) {
    commit('getData')
  }
}
