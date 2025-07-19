import { ToastContainer } from 'react-toastify';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {

  return (
    <>
      <section className='h-screen w-screen'>
        <Dashboard />
      </section>
      <ToastContainer position='bottom-right' />
    </>
  )
}

export default App
