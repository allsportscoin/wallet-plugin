import { connect } from 'react-redux';
import SendEther from './send.component';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import {
	getAmountConversionRate,
	getBlockGasLimit,
	getConversionRate,
	getCurrentNetwork,
	getGasLimit,
	getGasPrice,
	getGasTotal,
	getPrimaryCurrency,
	getRecentBlocks,
	getSelectedAddress,
	getSelectedToken,
	getSelectedTokenContract,
	getSelectedTokenToFiatRate,
	getSendAmount,
	getSendEditingTransactionId,
	getSendFromObject,
	getSendTo,
	getTokenBalance,
	getQrCodeData,
	getSelectSendType
} from './send.selectors';
import {
	updateSendTo,
	updateSendTokenBalance,
	updateGasData,
	setGasTotal,
	showQrScanner,
	qrCodeDetected,
} from '../../actions';
import {
	resetSendState,
	updateSendErrors,
} from '../../ducks/send.duck';
import {
	calcGasTotal,
} from './send.utils.js';

import {
	SEND_ROUTE,
} from '../../routes';

module.exports = compose(
	withRouter,
	connect(mapStateToProps, mapDispatchToProps)
)(SendEther);

function mapStateToProps (state) {
	return {
		amount: getSendAmount(state),
		amountConversionRate: getAmountConversionRate(state),
		blockGasLimit: getBlockGasLimit(state),
		conversionRate: getConversionRate(state),
		editingTransactionId: getSendEditingTransactionId(state),
		from: getSendFromObject(state),
		gasLimit: getGasLimit(state),
		gasPrice: getGasPrice(state),
		gasTotal: getGasTotal(state),
		network: getCurrentNetwork(state),
		primaryCurrency: getPrimaryCurrency(state),
		recentBlocks: getRecentBlocks(state),
		selectedAddress: getSelectedAddress(state),
		selectedToken: getSelectedToken(state),
		to: getSendTo(state),
		tokenBalance: getTokenBalance(state),
		tokenContract: getSelectedTokenContract(state),
		tokenToFiatRate: getSelectedTokenToFiatRate(state),
		qrCodeData: getQrCodeData(state),
		selectType: getSelectSendType(state)
	};
}

function mapDispatchToProps (dispatch) {
	return {
		updateAndSetGasTotal: ({
			                       blockGasLimit,
			                       editingTransactionId,
			                       gasLimit,
			                       gasPrice,
			                       recentBlocks,
			                       selectedAddress,
			                       selectedToken,
			                       to,
			                       value,
			                       isBind
		                       }) => {
			!editingTransactionId
				? dispatch(updateGasData({
					recentBlocks,
					selectedAddress,
					selectedToken,
					blockGasLimit,
					to,
					value,
					isBind
				}))
				: dispatch(setGasTotal(calcGasTotal(gasLimit, gasPrice)));
		},
		updateSendTokenBalance: ({ selectedToken, tokenContract, address }) => {
			dispatch(updateSendTokenBalance({
				selectedToken,
				tokenContract,
				address,
			}));
		},
		updateSendErrors: newError => dispatch(updateSendErrors(newError)),
		resetSendState: () => dispatch(resetSendState()),
		scanQrCode: () => dispatch(showQrScanner(SEND_ROUTE)),
		qrCodeDetected: (data) => dispatch(qrCodeDetected(data)),
		updateSendTo: (to, nickname) => dispatch(updateSendTo(to, nickname)),
	};
}
