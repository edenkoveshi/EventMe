import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Modal, Icon, style } from 'semantic-ui-react';
import Example from './Example.js';
import HomepageLayout from '../HomepageLayout.js';
import Login from '../LoginApp.js';

export default () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={HomepageLayout} />
			<Route exact path="/Example" component={Example} />
		</Switch>
	</BrowserRouter>);