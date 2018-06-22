export default function ({route, store: { dispatch }}) {
  if (process.server) {
    dispatch('setFirstPageVisited', route.name);
  }
}
