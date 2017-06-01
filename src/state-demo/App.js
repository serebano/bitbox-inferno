import React from 'react'

import Header from "./components/Header"
import MainSection from "./components/MainSection"

let nextTodoId = 1;

const App = ({todos}) => (
  <div>
    <Header addTodo={
        (text)=>{
          todos.push({id:nextTodoId++, completed:false, text})
        }
    } />
    <MainSection mapStateToProps={(todos)=>({todos})} state={todos} />
  </div>
);

export default App;
