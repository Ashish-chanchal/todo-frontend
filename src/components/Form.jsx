import { CheckCircle } from 'lucide-react'
import React from 'react'

function Form({getTodos}) {
const [formData, setFormData] = React.useState({title: '', description: ''})
const [message, setMessage] = React.useState('')
const [display, setDisplay] = React.useState(false)
const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: formData.title, description: formData.description})
    })
    setDisplay(true);
    getTodos();
setMessage(response.msg);
    setFormData({title: '', description: ''})
  }
  return (
    <div className='flex flex-col items-center justify-center m-10'>
        <h3 className='text-3xl font-bold flex items-center gap-2'>Create<span className='text-blue-400'>TODO</span> <CheckCircle/></h3>

        <form className='flex flex-col gap-2 w-full max-w-4xl '>
            <label htmlFor="title" className='text-xl mt-5'>Title</label>
            <input type="text" placeholder='Add title' className='border-2 border-blue-400 rounded-md p-2' name='title' id='title' value={formData.title} onChange={handleChange}/>
            <label htmlFor="description" className='text-xl mt-5'>Description</label>
            <textarea  placeholder='Add description' className='border-2 border-blue-400 rounded-md p-2' name='description' id='description' onChange={handleChange} value={formData.description}/>
            <button className='bg-blue-400 text-white rounded-md p-2 mt-4' disabled={!(formData.title&&formData.description)} onClick={handleSubmit}>Add Todo</button>

        </form>
<p className='mt-3 font-semibold  text-black'>{message}</p>
      
    </div>
  )
}

export default Form
