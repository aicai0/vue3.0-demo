export default function (state) {
  function addTodo () {
    state.todoList.push(
      { id: state.todoList.length, name: state.newTodo, status: false }
    )
  }
  return { addTodo }
}
