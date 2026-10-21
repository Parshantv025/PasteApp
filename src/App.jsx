import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Paste from './components/Paste.jsx'
import ViewPaste from './components/ViewPaste.jsx'
import { Toaster } from 'react-hot-toast'

const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <div>
          <Navbar />
          <Home />
        </div>
      ),
    },
    {
      path: '/pastes',
      element: (
        <div>
          <Navbar />
          <Paste />
        </div>
      ),
    },
    {
      path: '/pastes/:id',
      element: (
        <div>
          <Navbar />
          <ViewPaste />
        </div>
      ),
    },
    {
      path: '/pastes/:id/edit',
      element: (
        <div>
          <Navbar />
          <Home />
        </div>
      ),
    },
  ])

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  )
}

export default App
