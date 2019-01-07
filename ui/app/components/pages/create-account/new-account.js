import { contractAbi } from '../../../snsAbi';

const { Component } = require('react');
const PropTypes = require('prop-types');
const h = require('react-hyperscript');
const connect = require('react-redux').connect;
const actions = require('../../../actions');
const { DEFAULT_ROUTE } = require('../../../routes');
const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');

class NewAccountCreateForm extends Component {
	constructor (props, context) {
		super(props);

		const { numberOfExistingAccounts = 0 } = props;
		const newAccountNumber = numberOfExistingAccounts + 1;

		this.state = {
			newAccountName: '',
			defaultAccountName: context.t('newAccountNumberName', [newAccountNumber]),
		};
	}

	render () {
		const { newAccountName, defaultAccountName } = this.state;
		const { history, createAccount } = this.props;

		return h('div.new-account-create-form', [

			h('div.new-account-create-form__input-label', {}, [
				this.context.t('accountName'),
			]),

			h('div.new-account-create-form__input-wrapper', {}, [
				h('input.new-account-create-form__input', {
					value: newAccountName,
					placeholder: defaultAccountName,
					onChange: event => this.setState({ newAccountName: event.target.value }),
				}, []),
			]),

			h('div.new-account-create-form__buttons', {}, [

				h('button.btn-default.btn--large.new-account-create-form__button', {
					onClick: () => history.push(DEFAULT_ROUTE),
				}, [
					this.context.t('cancel'),
				]),

				h('button.btn-primary.btn--large.new-account-create-form__button', {
					onClick: () => {
						createAccount(newAccountName || defaultAccountName)
						.then(() => history.push(DEFAULT_ROUTE));
					},
				}, [
					this.context.t('create'),
				]),

			]),

		]);
	}
}

NewAccountCreateForm.propTypes = {
	hideModal: PropTypes.func,
	showImportPage: PropTypes.func,
	showConnectPage: PropTypes.func,
	createAccount: PropTypes.func,
	numberOfExistingAccounts: PropTypes.number,
	history: PropTypes.object,
	t: PropTypes.func,
};

const mapStateToProps = state => {
	const { metamask: { network, selectedAddress, identities = {} } } = state;
	const numberOfExistingAccounts = Object.keys(identities).length;

	return {
		network,
		address: selectedAddress,
		numberOfExistingAccounts,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		toCoinbase: address => dispatch(actions.buyEth({ network: '1', address, amount: 0 })),
		hideModal: () => dispatch(actions.hideModal()),
		createAccount: newAccountName => {
			return dispatch(actions.addNewAccount())
			.then(newAccountAddress => {
				if (newAccountName) {
					dispatch(actions.setAccountLabel(newAccountAddress, newAccountName));
					// const contractAddress = '0x018fc08fd1a6a74b6b5f10923538a163d3facea8';
					// let eth = new Eth(global.ethereumProvider);
					// let newContract = new EthContract(eth);
					// let contract = newContract(contractAbi);
					// const myContract = contract.at(contractAddress);
					// try {
					// 	myContract.getAliasByAddr(newAccountAddress, (error, res) => {
					// 		if (res && res[0]) {
					// 			dispatch(actions.setAccountLabel(newAccountAddress, newAccountName, res[0]));
					// 		} else {
					// 			dispatch(actions.setAccountLabel(newAccountAddress, newAccountName, ''));
					// 		}
					// 	});
					// } catch (e) {
					// 	dispatch(actions.setAccountLabel(newAccountAddress, newAccountName, ''));
					// }
				}
			});
		},
		showImportPage: () => dispatch(actions.showImportPage()),
		showConnectPage: () => dispatch(actions.showConnectPage()),
	};
};

NewAccountCreateForm.contextTypes = {
	t: PropTypes.func,
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(NewAccountCreateForm);

