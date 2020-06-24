import React from 'react';

const h = React.createElement;

import { createClassName, memo } from '../helpers';
import styles from './styles.scss';


export const ButtonGroup = memo(({ children }) => (
	<div className={createClassName(styles, 'button-group')}>
		{children.map((child) => h(child, { className: createClassName(styles, 'button-group__item') }, null))}
	</div>
));
