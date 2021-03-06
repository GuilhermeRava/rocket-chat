import { createClassName, MemoizedComponent } from '../helpers';
import styles from './styles.scss';


export class Form extends MemoizedComponent {
	static defaultHandleSubmit = (event) => {
		event.preventDefault();
	}

	render = ({ onSubmit, className, style = {}, children }) => (
		<form
			noValidate
			onSubmit={onSubmit || Form.defaultHandleSubmit}
			className={createClassName(styles, 'form', {}, [className])}
			style={style}
		>
			{children}
		</form>
	)
}

export const Validations = {
	nonEmpty: ({ value }) => (!value ? ('Field required') : undefined),

	email: ({ value }) => (!/^\S+@\S+\.\S+/.test(String(value).toLowerCase()) ? ('Invalid email') : null),

	custom: ({ value, pattern }) => (new RegExp(pattern, 'i').test(String(value)) ? null : ('Invalid value')),
};


export { FormField } from './FormField';
export { TextInput } from './TextInput';
export { PasswordInput } from './PasswordInput';
export { SelectInput } from './SelectInput';
