import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageContainerFooter from '../../page-container/page-container-footer';
import { CONFIRM_TRANSACTION_ROUTE, DEFAULT_ROUTE } from '../../../routes';

export default class SendFooter extends Component {

	static propTypes = {
		addToAddressBookIfNew: PropTypes.func,
		amount: PropTypes.string,
		data: PropTypes.string,
		clearSend: PropTypes.func,
		disabled: PropTypes.bool,
		editingTransactionId: PropTypes.string,
		errors: PropTypes.object,
		from: PropTypes.object,
		gasLimit: PropTypes.string,
		gasPrice: PropTypes.string,
		gasTotal: PropTypes.string,
		history: PropTypes.object,
		inError: PropTypes.bool,
		selectedToken: PropTypes.object,
		sign: PropTypes.func,
		to: PropTypes.string,
		toAccounts: PropTypes.array,
		tokenBalance: PropTypes.string,
		unapprovedTxs: PropTypes.object,
		update: PropTypes.func,
		selectType: PropTypes.object
	};

	static contextTypes = {
		t: PropTypes.func,
	};

	onCancel () {
		this.props.clearSend();
		this.props.history.push(DEFAULT_ROUTE);
	}

	onSubmit (event) {
		event.preventDefault();
		const {
			addToAddressBookIfNew,
			amount,
			data,
			editingTransactionId,
			from: { address: from },
			gasLimit: gas,
			gasPrice,
			selectedToken,
			sign,
			unapprovedTxs,
			// updateTx,
			update,
			toAccounts,
			history,
			selectType,
			updateSendTo
		} = this.props;
		// Should not be needed because submit should be disabled if there are errors.
		// const noErrors = !amountError && toError === null

		// if (!noErrors) {
		//   return
		// }

		// TODO: add nickname functionality
		let { to } = this.props;
		const { id } = selectType;
		if (Number(id) === 1 || (Number(id) === 2)){
			to = from;
			updateSendTo(to)
		}
		addToAddressBookIfNew(to, toAccounts);

		const promise = editingTransactionId
			? update({
				amount,
				data,
				editingTransactionId,
				from,
				gas,
				gasPrice,
				selectedToken,
				to,
				unapprovedTxs,
			})
			: sign({ data, selectedToken, to, amount, from, gas, gasPrice, type: String(id)});

		Promise.resolve(promise)
		.then(() => history.push(CONFIRM_TRANSACTION_ROUTE));
	}

	formShouldBeDisabled () {
		const { inError, selectedToken, tokenBalance, gasTotal, to, selectType } = this.props;
		const { id } = selectType;
		const missingTokenBalance = selectedToken && !tokenBalance;
		if (Number(id) === 1 || (Number(id) === 2)) {
			return !gasTotal || missingTokenBalance;
		}
		return inError || !gasTotal || missingTokenBalance || !to;
	}

	render () {
		return (
			<PageContainerFooter
				onCancel={ () => this.onCancel() }
				onSubmit={ e => this.onSubmit(e) }
				disabled={ this.formShouldBeDisabled() }
			/>
		);
	}

}
