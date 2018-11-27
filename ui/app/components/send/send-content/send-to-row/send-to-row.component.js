import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SendRowWrapper from '../send-row-wrapper/';
import EnsInput from '../../../ens-input';
import { getToErrorObject } from './send-to-row.utils.js';

export default class SendToRow extends Component {

	static propTypes = {
		closeToDropdown: PropTypes.func,
		inError: PropTypes.bool,
		network: PropTypes.string,
		openToDropdown: PropTypes.func,
		to: PropTypes.string,
		toAccounts: PropTypes.array,
		toDropdownOpen: PropTypes.bool,
		updateGas: PropTypes.func,
		updateSendTo: PropTypes.func,
		updateSendToError: PropTypes.func,
		scanQrCode: PropTypes.func,
		selectType: PropTypes.object
	};

	static contextTypes = {
		t: PropTypes.func,
	};

	handleToChange (to, nickname = '', toError) {
		const { updateSendTo, updateSendToError, updateGas } = this.props;
		const toErrorObject = getToErrorObject(to, toError);
		updateSendTo(to, nickname);
		updateSendToError(toErrorObject);
		if (toErrorObject.to === null) {
			updateGas({ to });
		}
	}

	render () {
		const {
			selectType,
			closeToDropdown,
			inError,
			network,
			openToDropdown,
			to,
			toAccounts,
			toDropdownOpen,
		} = this.props;
		const { id  } = selectType;
		let label = 'to';
		if ((Number(id) === 3 || Number(id) === 4)) {
			label = 'candidate';
		}
		return (
			<SendRowWrapper
				errorType={ 'to' }
				label={ `${this.context.t(label)}:` }
				showError={ inError }
			>
				<EnsInput
					scanQrCode={ _ => this.props.scanQrCode() }
					accounts={ toAccounts }
					closeDropdown={ () => closeToDropdown() }
					dropdownOpen={ toDropdownOpen }
					inError={ inError }
					name={ 'address' }
					network={ network }
					onChange={ ({ toAddress, nickname, toError }) => this.handleToChange(toAddress, nickname, toError) }
					openDropdown={ () => openToDropdown() }
					placeholder={ this.context.t('recipientAddress') }
					to={ to }
				/>
			</SendRowWrapper>
		);
	}

}
