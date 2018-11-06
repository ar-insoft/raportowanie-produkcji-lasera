import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 
import './App.css';
import RaportowanieForm from './raportowanieLasera/components/RaportowanieForm'

class App extends Component {
  render() {
    return (
      <div className="App">
        <RaportowanieForm />
        <ToastContainer
          position={toast.POSITION.TOP_RIGHT}
          closeOnClick={false}
          autoClose={6000}
          hideProgressBar={true}
        />  
      </div>
    );
  }
}

export default App;
