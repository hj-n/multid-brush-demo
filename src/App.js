import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import Demo from './demo/Demo';

function App() {

  return (
    <Router>
			<Routes>
				<Route path='/demo' element={<Demo />} />
			</Routes>
		</Router>
  );
}

export default App;
