
import './App.css'
import routes from './app.route.jsx';
import { RouterProvider } from 'react-router';

function App() {


  return (
    <>
    <RouterProvider router={routes} />  

    </>
  )
}

export default App
