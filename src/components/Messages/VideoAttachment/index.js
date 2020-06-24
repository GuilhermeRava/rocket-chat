import { createClassName, memo } from '../../helpers';
import { MessageBubble } from '../MessageBubble';
import styles from './styles.scss';


export const VideoAttachment = memo(({
	url,
	className,
	...messageBubbleProps
}) => (
	<MessageBubble
		nude
		className={createClassName(styles, 'video-attachment', {}, [className])}
		{...messageBubbleProps}
	>
		<video
			src={url}
			controls
			className={createClassName(styles, 'video-attachment__inner')}
		>
			{('You browser doesn\'t support video element')}
		</video>
	</MessageBubble>
));
