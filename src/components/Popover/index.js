import React, { Component } from 'react';

import { createClassName, normalizeDOMRect } from '../helpers';
import styles from './styles.scss';


const PopoverContext = React.createContext();


const PopoverOverlay = React.forwardRef(({ children, className, visible, ...props }, ref) => (
	<div
		className={createClassName(styles, 'popover__overlay', { visible }, [className])}
		ref={ref}
		{...props}
	>
		{children}
	</div>
));


export class PopoverContainer extends Component {
	state = {
		renderer: null,
	}
	overlayRef = React.createRef()

	open = (renderer, props, { currentTarget } = {}) => {
		let overlayBounds;
		let triggerBounds;

		if (this.overlayRef && this.overlayRef.current) {
			overlayBounds = normalizeDOMRect(this.overlayRef.current.getBoundingClientRect());
		}

		if (currentTarget) {
			triggerBounds = normalizeDOMRect(currentTarget.getBoundingClientRect());
		}

		this.setState({ renderer, ...props, overlayBounds, triggerBounds });
	}

	dismiss = () => {
		this.setState({ renderer: null, overlayBounds: null, triggerBounds: null });
	}

	handleOverlayGesture = ({ currentTarget, target }) => {
		if (currentTarget !== target) {
			return;
		}

		this.dismiss();
	}

	handleKeyDown = ({ key }) => {
		if (key !== 'Escape') {
			return;
		}

		this.dismiss();
	}

	// handleOverlayRef = (ref) => {
	// 	this.overlayRef = ref;
	// }

	componentDidMount() {
		this.mounted = true;
		window.addEventListener('keydown', this.handleKeyDown, false);
	}

	componentWillUnmount() {
		this.mounted = false;
		window.removeEventListener('keydown', this.handleKeyDown, false);
	}

	render = () => {
		const { children } = this.props;
		const { renderer, overlayProps, overlayBounds, triggerBounds } = this.state;

		return(
		<PopoverContext.Provider value={{ open: this.open }}>
			<div className={createClassName(styles, 'popover__container')}>
				{children}
				<PopoverOverlay
					ref={this.overlayRef}
					onMouseDown={this.handleOverlayGesture}
					onTouchStart={this.handleOverlayGesture}
					visible={!!renderer}
					{...overlayProps}
				>
					{renderer ? renderer({ dismiss: this.dismiss, overlayBounds, triggerBounds }) : null}
				</PopoverOverlay>
			</div>
		</PopoverContext.Provider>
	)
	}
}


export const PopoverTrigger = ({ children, ...props }) => (
	<PopoverContext.Consumer>
		{({ open }) => children[0]({ pop: open.bind(null, children[1], props) })}
	</PopoverContext.Consumer>
);
