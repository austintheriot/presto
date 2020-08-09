import React, { useState, useEffect } from 'react';

//pages
import LoadingScreen from './Pages/LoadingScreen/LoadingScreen';
import HomePublic from './Pages/HomePublic/HomePublic';
import HomePrivate from './Pages/HomePrivate/HomePrivate';
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/Signup';
import SignupPersonal from './Pages/SignupPersonal/SignupPersonal';
import SignupLocation from './Pages/SignupLocation/SignupLocation';
import SignupProfile from './Pages/SignupProfile/SignupProfile';
import LogoutByRender from './components/LogoutByRender';
import Posts from './Pages/Posts/Posts';
import IndividualPost from './Pages/IndividualPost/IndividualPost';
import Profile from './Pages/Profile/Profile';
import Settings from './Pages/Settings/Settings';

//components
import PrivateRoute from './components/PrivateRoute';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	withRouter,
} from 'react-router-dom';
import authListener from './util/authListener';

//context
import { AuthContext } from './util/AuthProvider';

//styling
import './App.css';

function App() {
	const [user, setUser] = useState(false);
	const [posts, setPosts] = useState(null); //cached posts to prevent unecessary calls to database

	/* 	const fakeDelay = (delayTime) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(), delayTime);
		});
	};
	fakeDelay(5000).then(() => {});
 */

	useEffect(() => {
		//authListener initializes authentication & user data, then listens for changes in either
		//set up a listener for changes in user authentication:
		// pass that information through Context API to components that need it
		authListener(setUser);
	}, []);

	return (
		<AuthContext.Provider value={{ user, setUser, posts, setPosts }}>
			<Router>
				<div className='App'>
					{user.init ? (
						<>
							<Switch>
								<Route exact path='/' component={HomePublic} />
								<Route exact path='/logout' component={LogoutByRender} />
								<Route exact path='/login' component={Login} />
								<Route exact path='/signup' component={Signup} />
								<PrivateRoute
									exact
									path='/signup-personal'
									component={SignupPersonal}
								/>
								<PrivateRoute
									exact
									path='/signup-location'
									component={SignupLocation}
								/>
								<PrivateRoute
									exact
									path='/signup-profile'
									component={SignupProfile}
								/>
								<PrivateRoute exact path='/home' component={HomePrivate} />
								<PrivateRoute exact path='/posts' component={Posts} />
								<PrivateRoute path='/posts/*' component={IndividualPost} />
								<PrivateRoute exact path='/profile' component={Profile} />
								<PrivateRoute exact path='/settings' component={Settings} />
								<Route path='*' component={HomePublic} />
							</Switch>
						</>
					) : (
						<LoadingScreen />
					)}
				</div>
			</Router>
		</AuthContext.Provider>
	);
}

//wrapping the App in a higher order component
//to access redirect props in Login component
//display messages like: please log in to see this page
const AppWithRouter = withRouter(App);

//surrounding app with Router
const AppContainer = () => {
	return (
		<Router>
			<AppWithRouter />
		</Router>
	);
};

export default AppContainer;
