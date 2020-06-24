import React, { Component } from 'react';

const h = React.createElement;

import { createClassName, normalizeDOMRect } from '../helpers';
import { PopoverTrigger } from '../Popover';
import styles from './styles.scss';


export const Menu = React.forwardRef(({ children, hidden, placement, ...props }, ref) => (
	<div className={createClassName(styles, 'menu', { hidden, placement })} {...props} ref={ref}>
		{children}
	</div>
));


export const Group = ({ children, title, ...props }) => (
	<div className={createClassName(styles, 'menu__group')} {...props}>
		{title && <div className={createClassName(styles, 'menu__group-title')}>{title}</div>}
		{children}
	</div>
);


export const Item = ({ children, primary, danger, disabled, icon, ...props }) => (
	<button
		className={createClassName(styles, 'menu__item', { primary, danger, disabled })}
		disabled={disabled}
		{...props}
	>
		{icon && (
			<div className={createClassName(styles, 'menu__item__icon')}>
				{h(icon)}
			</div>
		)}
		{children}
	</button>
);


class PopoverMenuWrapper extends Component {
	state = {}
	menuRef = React.createRef();
	// handleRef = (ref) => {
	// 	this.menuRef = ref;
	// }

	handleClick = ({ target }) => {
		if (!target.closest(`.${ styles.menu__item }`)) {
			return;
		}

		const { dismiss } = this.props;
		dismiss();
	}

	componentDidMount() {
		const { triggerBounds, overlayBounds } = this.props;
		const menuBounds = normalizeDOMRect(this.menuRef.current.getBoundingClientRect());

		const menuWidth = menuBounds.right - menuBounds.left;
		const menuHeight = menuBounds.bottom - menuBounds.top;

		const rightSpace = overlayBounds.right - triggerBounds.left;
		const bottomSpace = overlayBounds.bottom - triggerBounds.bottom;

		const left = menuWidth < rightSpace ? triggerBounds.left - overlayBounds.left : null;
		const right = menuWidth < rightSpace ? null : overlayBounds.right - triggerBounds.right;

		const top = menuHeight < bottomSpace ? triggerBounds.bottom : null;
		const bottom = menuHeight < bottomSpace ? null : overlayBounds.bottom - triggerBounds.top;

		const placement = `${ menuWidth < rightSpace ? 'right' : 'left' }-${ menuHeight < bottomSpace ? 'bottom' : 'top' }`;

		// eslint-disable-next-line react/no-did-mount-set-state
		this.setState({
			position: { left, right, top, bottom },
			placement,
		});
	}

	render = () => {
		const { children } = this.props;
		return (
			<Menu
				ref={this.menuRef}
				style={{ position: 'absolute', ...this.state.position }}
				placement={this.state.placement}
				onClickCapture={this.handleClick}
			>
				{children}
			</Menu>
		)
	}
}


export const PopoverMenu = ({ children, trigger, overlayed }) => (
	<PopoverTrigger
		overlayProps={{
			className: overlayed ? createClassName(styles, 'popover-menu__overlay') : null,
		}}
	>
		{trigger}
		{({ dismiss, triggerBounds, overlayBounds }) => (
			<PopoverMenuWrapper
				dismiss={dismiss}
				triggerBounds={triggerBounds}
				overlayBounds={overlayBounds}
			>
				{children}
			</PopoverMenuWrapper>
		)}
	</PopoverTrigger>
);


Menu.Group = Group;
Menu.Item = Item;
Menu.Popover = PopoverMenu;


export default Menu;
