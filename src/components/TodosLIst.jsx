import React from 'react';

function TodosList({ todos, makeComplete,deleteTodo }) {
  return (
    <div className='mt-16 flex flex-col gap-6 items-center justify-center w-full px-4 lg:px-8 mb-12'>
      <h3 className='text-4xl font-semibold text-center'>
        Your <span className='text-blue-500'>TODO</span>
      </h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8 w-full'>
        {todos.map((todo) => (
          <div
            className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-gray-200 relative flex flex-col justify-between h-full'
            key={todo._id}
          >
            <div>
              <h3 className='text-2xl font-semibold text-gray-700'>{todo.title}</h3>
              <p className='mt-4 text-gray-600 text-sm line-clamp-4 overflow-hidden'>
                {todo.description}
              </p>
            </div>

            {todo.completed ? (
              <p className='text-green-500 mt-4 font-medium'>Completed</p>
            ) : (
             
              <div>
                 <button
                className='mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 w-full'
                onClick={() => makeComplete(todo._id)}
              >
                Mark as complete
              </button>
              <button
                className='mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 w-full'
                onClick={() => deleteTodo(todo._id)}
              >
                Delete
              </button>
              </div>

            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodosList;
