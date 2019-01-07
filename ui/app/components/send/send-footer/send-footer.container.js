import { connect } from 'react-redux';
import ethUtil from 'ethereumjs-util';
import {
	addToAddressBook,
	clearSend,
	signTokenTx,
	signTx,
	updateTransaction,
	updateSendTo
} from '../../../actions';
import SendFooter from './send-footer.component';
import {
	getGasLimit,
	getGasPrice,
	getGasTotal,
	getSelectedToken,
	getSendAmount,
	getSendEditingTransactionId,
	getSendFromObject,
	getSendTo,
	getSendToAccounts,
	getSendHexData,
	getTokenBalance,
	getUnapprovedTxs,
	getSelectSendType,
	getExtra
} from '../send.selectors';
import {
	isSendFormInError,
} from './send-footer.selectors';
import {
	addressIsNew,
	constructTxParams,
	constructUpdatedTx,
} from './send-footer.utils';

export default connect(mapStateToProps, mapDispatchToProps)(SendFooter);

function mapStateToProps (state) {
	return {
		amount: getSendAmount(state),
		data: getSendHexData(state),
		editingTransactionId: getSendEditingTransactionId(state),
		from: getSendFromObject(state),
		gasLimit: getGasLimit(state),
		gasPrice: getGasPrice(state),
		gasTotal: getGasTotal(state),
		inError: isSendFormInError(state),
		selectedToken: getSelectedToken(state),
		to: getSendTo(state),
		toAccounts: getSendToAccounts(state),
		tokenBalance: getTokenBalance(state),
		unapprovedTxs: getUnapprovedTxs(state),
		selectType: getSelectSendType(state),
		extra: getExtra(state),
	};
}

function mapDispatchToProps (dispatch) {
	return {
		clearSend: () => dispatch(clearSend()),
		sign: ({ selectedToken, to, amount, from, gas, gasPrice, data, type, extra }) => {
			const txParams = constructTxParams({
				amount,
				data,
				from,
				gas,
				gasPrice,
				selectedToken,
				to,
				type,
				extra
			});

			selectedToken
				? dispatch(signTokenTx(selectedToken.address, to, amount, txParams))
				: dispatch(signTx(txParams));
		},
		update: ({
			         amount,
			         data,
			         editingTransactionId,
			         from,
			         gas,
			         gasPrice,
			         selectedToken,
			         to,
			         unapprovedTxs,
		         }) => {
			const editingTx = constructUpdatedTx({
				amount,
				data,
				editingTransactionId,
				from,
				gas,
				gasPrice,
				selectedToken,
				to,
				unapprovedTxs,
			});

			return dispatch(updateTransaction(editingTx));
		},
		addToAddressBookIfNew: (newAddress, toAccounts, nickname = '') => {
			const hexPrefixedAddress = ethUtil.addHexPrefix(newAddress);
			if (addressIsNew(toAccounts)) {
				// TODO: nickname, i.e. addToAddressBook(recipient, nickname)
				dispatch(addToAddressBook(hexPrefixedAddress, nickname));
			}
		},
		updateSendTo: (newTo, nickname) => dispatch(updateSendTo(newTo, nickname)),
	};
}
