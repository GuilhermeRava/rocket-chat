import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { useHistory } from "react-router-dom";


import queryString from 'query-string';

import history from '../../history';
import Chat from '../../routes/Chat';
import LeaveMessage from '../../routes/LeaveMessage';
import ChatFinished from '../../routes/ChatFinished';
import SwitchDepartment from '../../routes/SwitchDepartment';
import GDPRAgreement from '../../routes/GDPRAgreement';
import Register from '../../routes/Register';
import { Provider as StoreProvider, Consumer as StoreConsumer } from '../../store';
import { visibility } from '../helpers';
import { setWidgetLanguage } from '../../lib/locale';
import CustomFields from '../../lib/customFields';
import Triggers from '../../lib/triggers';
import Hooks from '../../lib/hooks';
import { parentCall } from '../../lib/parentCall';
import userPresence from '../../lib/userPresence';
import Connection from '../../lib/connection';

function isRTL(s) {
	const rtlChars = '\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC';
	const rtlDirCheck = new RegExp(`^[^${ rtlChars }]*?[${ rtlChars }]`);

	return rtlDirCheck.test(s);
}

export class App extends Component {
	state = {
		initialized: false,
	}

	handleRoute = async () => {
		let history = useHistory();

		setTimeout(() => {
			const {
				config: {
					settings: {
						registrationForm,
						nameFieldRegistrationForm,
						emailFieldRegistrationForm,
						forceAcceptDataProcessingConsent: gdprRequired,
					},
					online,
					departments = [],
				},
				gdpr: {
					accepted: gdprAccepted,
				},
				triggered,
				user,
			} = this.props;

			if (gdprRequired && !gdprAccepted) {
				return history.push('/gdpr');
			}

			if (!online) {
				parentCall('callback', 'no-agent-online');
				return history.push('/leave-message');
			}

			const showDepartment = departments.filter((dept) => dept.showOnRegistration).length > 0;

			const showRegistrationForm = (
				registrationForm
					&& (nameFieldRegistrationForm || emailFieldRegistrationForm || showDepartment)
			)
				&& !triggered
				&& !(user && user.token);
			if (showRegistrationForm) {
				return history.push('/register');
			}
		}, 100);
	}

	handleTriggers() {
		const { config: { online, enabled } } = this.props;

		Triggers.enabled = online && enabled;

		if (online && enabled) {
			Triggers.init();
		}
	}

	handleEnableNotifications = () => {
		const { dispatch, sound = {} } = this.props;
		dispatch({ sound: { ...sound, enabled: true } });
	}

	handleDisableNotifications = () => {
		const { dispatch, sound = {} } = this.props;
		dispatch({ sound: { ...sound, enabled: false } });
	}

	handleMinimize = () => {
		parentCall('minimizeWindow');
		const { dispatch } = this.props;
		dispatch({ minimized: true });
	}

	handleRestore = () => {
		parentCall('restoreWindow');
		const { dispatch } = this.props;
		dispatch({ minimized: false, undocked: false });
	}

	handleOpenWindow = () => {
		parentCall('openPopout');
		const { dispatch } = this.props;
		dispatch({ undocked: true });
	}

	handleDismissAlert = (id) => {
		const { dispatch, alerts = [] } = this.props;
		dispatch({ alerts: alerts.filter((alert) => alert.id !== id) });
	}

	handleVisibilityChange = async () => {
		const { dispatch } = this.props;
		await dispatch({ visible: !visibility.hidden });
	}

	handleLanguageChange = () => {
		this.forceUpdate();
	}

	initWidget() {
		setWidgetLanguage();
		const { minimized, iframe: { visible } } = this.props;
		parentCall(minimized ? 'minimizeWindow' : 'restoreWindow');
		parentCall(visible ? 'showWidget' : 'hideWidget');

		visibility.addListener(this.handleVisibilityChange);
		this.handleVisibilityChange();
		window.addEventListener('beforeunload', () => {
			visibility.removeListener(this.handleVisibilityChange);
		});

		// I18n.on('change', this.handleLanguageChange);
	}

	async initialize() {
		// TODO: split these behaviors into composable components
		await Connection.init();
		this.handleTriggers();
		CustomFields.init();
		Hooks.init();
		userPresence.init();
		this.initWidget();

		this.setState({ initialized: true });
		parentCall('ready');
	}

	async finalize() {
		CustomFields.reset();
		userPresence.reset();
		visibility.removeListener(this.handleVisibilityChange);
		// I18n.off('change', this.handleLanguageChange);
	}

	componentDidMount() {
		this.initialize();
	}

	componentWillUnmount() {
		this.finalize();
	}

	componentDidUpdate() {
		// document.dir = isRTL(('Yes')) ? 'rtl' : 'auto';
	}

	render = () => {
		const {sound, undocked, minimized, expanded, alerts, modal, } = this.props;
		const { initialized } = this.state;
		
		if (!initialized) {
			return null;
		}

		const poppedOut = queryString.parse(window.location.search).mode === 'popout';

		const screenProps = {
			notificationsEnabled: sound && sound.enabled,
			minimized: !poppedOut && (minimized || undocked),
			expanded: !minimized && expanded,
			windowed: !minimized && poppedOut,
			sound,
			alerts,
			modal,
			onEnableNotifications: this.handleEnableNotifications,
			onDisableNotifications: this.handleDisableNotifications,
			onMinimize: this.handleMinimize,
			onRestore: this.handleRestore,
			onOpenWindow: this.handleOpenWindow,
			onDismissAlert: this.handleDismissAlert,
		};

		return (
			<Router history={history} onChange={this.handleRoute}>
				<Switch>
      				<Route exact path="/">
						<Chat {...screenProps} />
					</Route>
      				<Route exact path="/register">
					  	<Register path="/register" {...screenProps} />
					</Route>
      				<Route exact path="/leave-message">
					  	<LeaveMessage path="/leave-message" {...screenProps} />
					</Route>
      				<Route exact path="/gdpr">
					  	<GDPRAgreement path="/gdpr" {...screenProps} />
					</Route>
      				<Route exact path="/chat-finished">
					  	<ChatFinished path="/chat-finished" {...screenProps} />
					</Route>
      				<Route exact path="/switch-department">
						<SwitchDepartment path="/switch-department" {...screenProps} />
					</Route>
				</Switch>
			</Router>
		);
	}
}

const AppConnector = () => (
	<StoreProvider>
		<div id="app">
			<StoreConsumer>
				{({
					config,
					user,
					triggered,
					gdpr,
					sound,
					undocked,
					minimized = true,
					expanded = false,
					alerts,
					modal,
					dispatch,
					iframe,
				}) => (
					<App
						config={config}
						gdpr={gdpr}
						triggered={triggered}
						user={user}
						sound={sound}
						undocked={undocked}
						minimized={minimized}
						expanded={expanded}
						alerts={alerts}
						modal={modal}
						dispatch={dispatch}
						iframe={iframe}
					/>
				)}
			</StoreConsumer>
		</div>
	</StoreProvider>
);

export default AppConnector;
