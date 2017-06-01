import React, { Component, PropTypes } from 'react'
import TodoItem from './TodoItem'
import Footer from './Footer'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'
import observercomponent from '../nx-observe-react/observercomponent'

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.completed,
  [SHOW_COMPLETED]: todo => todo.completed
}

class MainSection extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired
  }

  state = { filter: SHOW_ALL }

  handleClearCompleted = () => {
    let {todos} = this.props,
    completedTodo;
    do {
      completedTodo = todos.find((todo)=>todo.completed);
      this.deleteTodo(completedTodo);
    }
    while(completedTodo)
  }

  handleShow = filter => {
    this.setState({ filter })
  }

  renderToggleAll(completedCount) {
    const { todos } = this.props
    if (todos.length > 0) {
      return (
        <input className="toggle-all"
               type="checkbox"
               checked={completedCount === todos.length}
        />
      )
    }
  }

  renderFooter(completedCount) {
    const { todos } = this.props
    const { filter } = this.state
    const activeCount = todos.length - completedCount

    if (todos.length) {
      return (
        <Footer completedCount={completedCount}
                activeCount={activeCount}
                filter={filter}
                onClearCompleted={this.handleClearCompleted.bind(this)}
                onShow={this.handleShow.bind(this)} />
      )
    }
  }

  editTodo(todo, text){
    todo.text = text;
  }

  completeTodo(todo){
    todo.completed = true;
  }

  deleteTodo(todo){
    let {todos} = this.props, 
    deletionCandidate = todos.indexOf(todo);
    todos.splice(deletionCandidate, 1);
  }

  mapTodoItemStateToProps(todo){
    return ({
      todo, 
      editTodo:this.editTodo.bind(this), 
      deleteTodo:this.deleteTodo.bind(this), 
      completeTodo:this.completeTodo.bind(this)
    });
  }

  render() {
    const { todos } = this.props
    const { filter } = this.state

    const filteredTodos = todos.filter(TODO_FILTERS[filter])
    const completedCount = todos.reduce((count, todo) =>
      todo.completed ? count + 1 : count,
      0
    )

    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            <TodoItem key={todo.id} mapStateToProps={this.mapTodoItemStateToProps.bind(this)} state={todo}/>
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    )
  }
}

export default observercomponent(MainSection);