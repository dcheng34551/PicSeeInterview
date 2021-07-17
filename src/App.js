import Main from './components/Main';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
	return (
		<Router>
			<div className="App">
				<Switch>
					<Route path="/" exact render={(props) => <Main {...props} />} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
