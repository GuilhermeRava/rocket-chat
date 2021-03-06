import React, { Component } from 'react';

import { Button } from '../../components/Button';
import { ButtonGroup } from '../../components/ButtonGroup';
import { Form, FormField, SelectInput, Validations } from '../../components/Form';
import Screen from '../../components/Screen';
import { createClassName } from '../../components/helpers';
import styles from './styles.scss';


const defaultTitle = ('Change Department');
const defaultMessage = ('Choose a department');

export default class SwitchDepartment extends Component {
	state = {
		department: null,
	}

	validations = {
		department: [Validations.nonEmpty],
	}

	getValidableFields = () => Object.keys(this.validations)
		.map((fieldName) => (this.state[fieldName] ? { fieldName, ...this.state[fieldName] } : null))
		.filter(Boolean)

	validate = (fieldName, value) => this.validations[fieldName].reduce((error, validation) => error || validation(value), undefined)

	validateAll = () => {
		for (const { fieldName, value } of this.getValidableFields()) {
			const error = this.validate(fieldName, value);
			this.setState({ [fieldName]: { ...this.state[fieldName], value, error, showError: false } });
		}
	}

	isValid = () => this.getValidableFields().every(({ error } = {}) => !error)

	handleFieldChange = (fieldName) => ({ target: { value } }) => {
		const error = this.validate(fieldName, value);
		this.setState({ [fieldName]: { ...this.state[fieldName], value, error, showError: false } });
	}

	handleDepartmentChange = this.handleFieldChange('department')

	handleSubmit = (event) => {
		event.preventDefault();

		if (this.props.onSubmit) {
			const values = Object.entries(this.state)
				.filter(([, state]) => state !== null)
				.map(([name, { value }]) => ({ [name]: value }))
				.reduce((values, entry) => ({ ...values, ...entry }), {});
			this.props.onSubmit(values);
		}
	}

	handleCancelClick = () => {
		const { onCancel } = this.props;
		onCancel && onCancel();
	}

	constructor(props) {
		super(props);

		const { departments } = props;
		if (departments && departments.length > 0) {
			this.state.department = { value: '' };
		}

		this.validateAll();
	}

	componentWillReceiveProps() {
		if (!this.state.department) {
			this.setState({ department: { ...this.state.department, value: '' } });
		}
	}

	render({ title, color, message, loading, departments, ...props }, { department }) {
		const valid = this.isValid();
		return (
			<Screen
				color={color}
				title={title || defaultTitle}
				className={createClassName(styles, 'switch-department')}
				{...props}
			>
				<Screen.Content>
					<p className={createClassName(styles, 'switch-department__message')}>{message || defaultMessage}</p>

					<Form onSubmit={this.handleSubmit}>
						<FormField
							label={('Departments')}
							error={department && department.showError && department.error}
						>
							<SelectInput
								name="department"
								value={department && department.value}
								options={departments.map(({ _id, name }) => ({ value: _id, label: name }))}
								placeholder={('Choose a department...')}
								disabled={loading}
								error={department && department.showError}
								onInput={this.handleDepartmentChange}
							/>
						</FormField>

						<ButtonGroup>
							<Button submit loading={loading} disabled={!valid || loading} stack>{('Start chat')}</Button>
							<Button disabled={loading} stack secondary nude onClick={this.handleCancelClick}>{('Cancel')}</Button>
						</ButtonGroup>
					</Form>
				</Screen.Content>
				<Screen.Footer />
			</Screen>
		);
	}
}
