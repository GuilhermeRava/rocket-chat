import { createClassName, memo } from '../../helpers';
import styles from './styles.scss';
import React from 'react';

export const ComposerActions = memo(({ className, style = {}, children }) => (
	<div
		className={createClassName(styles, 'composer__actions', {}, [className])}
		style={style}
	>
		{children}
	</div>
));
