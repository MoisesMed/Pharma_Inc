import Routes from './Routes.js'
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ActionBar from "./components/ActionBar/ActionBar"

function App() {
  return (
    <BrowserRouter>
      <ActionBar />
      <Routes />
    </BrowserRouter>
  );
}

export default App;
