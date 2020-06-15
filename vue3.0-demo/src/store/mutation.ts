import moduleState from '@/store/constant'
type State = typeof moduleState;

const mutation = {
  getData (state: State) {
    state.loading = !state.loading
  }
}
export default mutation
