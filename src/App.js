import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import Demo from './demo/Demo';
import CalHousingDemo from './demo/Calhousing';


function App() {

  return (
    <Router>
			<Routes>
				<Route path='/demo' element={<Demo />} />
				<Route path='/calhousing' element={<CalHousingDemo />} />
			</Routes>
		</Router>
  );
}

export default App;
