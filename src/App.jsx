import React from 'react'
import { useEffect } from "react"
import Form from "./components/Form"
import NavBar from "./components/NavBar"
import TodosLIst from "./components/TodosLIst"



function App() {
  const [todos, setTodos] = React.useState([]);

 
  
  async function  getTodos  (){
    const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/todos`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json'
      }
    });
    const json= await res.json();
    console.log(json);
    setTodos(json.todos);
  } 
  useEffect(() => {
    getTodos();
  }, [])
 async function makeComplete(id){
   const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/completed`,{
     method:'PUT',
     headers:{
       'Content-Type':'application/json'
     },
     body:JSON.stringify({id:id})
   });
   const json = await res.json();
   console.log(json);
    getTodos();
 }
async function deleteTodo(id){
  const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/delete`,{
    method:'DELETE',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({id:id})
  });
  const json = await res.json();
  console.log(json);
   getTodos();
}
  return (
    <>
    <NavBar/>
  <Form getTodos={getTodos} />
  <TodosLIst todos={todos} makeComplete={makeComplete} deleteTodo={deleteTodo}/>

    </>
  )
}

export default App;
