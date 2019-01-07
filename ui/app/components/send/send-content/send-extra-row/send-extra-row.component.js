import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SendRowWrapper from '../send-row-wrapper';

export default class SendExtraRow extends Component {
	static propTypes = {
		extra: PropTypes.string,
		inError: PropTypes.bool,
		updateExtraData: PropTypes.func.isRequired,
	};

	static contextTypes = {
		t: PropTypes.func,
	};

	onInput = (event) => {
		const { updateExtraData } = this.props;
		event.target.value = event.target.value.replace(/\n/g, '');
		if (event.target.value !== '' && !(/^[A-Za-z0-9+/=,.'" ]+$/.test(event.target.value))) {
			return;
		}
		updateExtraData(event.target.value || '');
	};

	render () {
		const { inError, extra } = this.props;
		const { t } = this.context;

		return (
			<SendRowWrapper
				label={ `${t('extra')}:` }
				showError={ inError }
				errorType={ 'amount' }
			>
        <textarea
	        value={ extra }
	        onInput={ this.onInput }
	        placeholder={ `${t('Optional')}` }
	        className="send-v2__extra-data__input"
	        maxLength={ 32 }
        />
			</SendRowWrapper>
		);
	}
}
