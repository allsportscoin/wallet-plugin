const actions = require('../actions');
import { connect } from 'react-redux';

const { compose } = require('recompose');
import { withRouter } from 'react-router-dom';
import { closeWelcomeScreen } from '../actions';

const { SEND_ROUTE } = require('../routes');
const { Component } = require('react');
const PropTypes = require('prop-types');
const h = require('react-hyperscript');
const classnames = require('classnames');

class EditableLabel extends Component {
	constructor (props) {
		super(props);

		this.state = {
			isEditing: false,
			value: props.defaultValue || '',
		};
	}

	handleSubmit () {
		const { value } = this.state;
		const { history, hideSidebar, hideModal } = this.props;
		if (value.trim() === '' || !(/^[a-zA-Z]([a-zA-Z0-9]{6,12})$/.test(value))) {
			return;
		}
		Promise.resolve(this.props.onSubmit(value))
		.then(() => {
			this.setState({ isEditing: false });
			hideModal();
			hideSidebar();
			history.push({
				pathname: SEND_ROUTE,
				state: {
					'isBind': 1,
					'bindValue': `${value}.soc`
				}
			});
		});
	}

	saveIfEnter (event) {
		if (event.key === 'Enter') {
			this.handleSubmit();
		}
	}

	snsRules (value) {
		if (value.trim() === '') {
			return true;
		}
		let reg = /^[a-zA-Z]([a-zA-Z0-9]{6,12})$/;
		return !reg.test(value);
	}

	renderEditing () {
		const { value } = this.state;

		return ([
			h('input.large-input.editable-label__input', {
				minLength: 7,
				maxLength: 12,
				type: 'text',
				required: true,
				value: this.state.value,
				onKeyPress: (event) => {
					if (event.key === 'Enter') {
						this.handleSubmit();
					}
				},
				onChange: event => this.setState({ value: event.target.value }),
				className: classnames({ 'editable-label__input--error': this.snsRules(value) }),
			}),
			h('div.editable-label__icon-wrapper', [
				h('i.fa.fa-check.editable-label__icon', {
					onClick: () => this.handleSubmit(),
				}),
			]),
		]);
	}

	renderReadonly () {
		return ([
			h('div.editable-label__value', this.state.value),
			h('div.editable-label__icon-wrapper', [
				h('i.fa.fa-pencil.editable-label__icon', {
					onClick: () => this.setState({ isEditing: true }),
				}),
			]),
		]);
	}

	render () {
		const { isEditing } = this.state;
		const { className } = this.props;

		return (
			h('div.editable-label', { className: classnames(className) },
				isEditing
					? this.renderEditing()
					: this.renderReadonly()
			)
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		hideSidebar: () => { dispatch(actions.hideSidebar());},
		hideModal: () => {dispatch(actions.hideModal());},
	};
};

EditableLabel.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	defaultValue: PropTypes.string,
	className: PropTypes.string,
	history: PropTypes.object,
};

module.exports = compose(
	withRouter,
	connect(mapStateToProps, mapDispatchToProps)
)(EditableLabel);
