import React, { Component } from 'react';
import { useHistory } from "react-router-dom";

import { Consumer } from '../../store';
import ChatFinished from './component';


export class ChatFinishedContainer extends Component {
	handleRedirect = () => {
		route('/');
	}

	render = (props) => (
		<ChatFinished {...props} onRedirectChat={this.handleRedirect} />
	)
}


export const ChatFinishedConnector = ({ ref, ...props }) => (
	<Consumer>
		{({
			config: {
				messages: {
					conversationFinishedMessage: greeting,
					conversationFinishedText: message,
				} = {},
				theme: {
					color,
				} = {},
			} = {},
			iframe: {
				theme: {
					color: customColor,
					fontColor: customFontColor,
					iconColor: customIconColor,
				} = {},
			} = {},
		}) => (
			<ChatFinishedContainer
				ref={ref}
				{...props}
				theme={{
					color: customColor || color,
					fontColor: customFontColor,
					iconColor: customIconColor,
				}}
				title={'Chat Finished'}
				greeting={greeting}
				message={message}
			/>
			// <ChatFinishedContainer
			// 	ref={ref}
			// 	{...props}
			// 	theme={{
			// 		color: customColor || color,
			// 		fontColor: customFontColor,
			// 		iconColor: customIconColor,
			// 	}}
			// 	title={('Chat Finished')}
			// 	greeting={greeting}
			// 	message={message}
			// />
		)}
	</Consumer>
);


export default ChatFinishedConnector;
