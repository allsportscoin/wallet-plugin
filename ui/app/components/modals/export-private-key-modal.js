import getSnsAddress from '../../../lib/getSnsAddress';
import { contractAbi } from '../../snsAbi';

const Component = require('react').Component;
const PropTypes = require('prop-types');
const h = require('react-hyperscript');
const inherits = require('util').inherits;
const connect = require('react-redux').connect;
const { stripHexPrefix } = require('ethereumjs-util');
const actions = require('../../actions');
const AccountModalContainer = require('./account-modal-container');
const { getSelectedIdentity } = require('../../selectors');
const ReadOnlyInput = require('../readonly-input');
const copyToClipboard = require('copy-to-clipboard');
const { checksumAddress } = require('../../util');
const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');

function mapStateToProps (state) {
	return {
		warning: state.appState.warning,
		privateKey: state.appState.accountDetail.privateKey,
		metamask: state.metamask,
		network: state.metamask.network,
		selectedIdentity: getSelectedIdentity(state),
		previousModalState: state.appState.modal.previousModalState.name,
	};
}

function mapDispatchToProps (dispatch) {
	return {
		exportAccount: (password, address) => dispatch(actions.exportAccount(password, address)),
		showAccountDetailModal: () => dispatch(actions.showModal({ name: 'ACCOUNT_DETAILS' })),
		hideModal: () => dispatch(actions.hideModal()),
	};
}

inherits(ExportPrivateKeyModal, Component);

function ExportPrivateKeyModal () {
	Component.call(this);

	this.state = {
		password: '',
		privateKey: null,
		snsName: ''
	};
	this.getSnsName = getSnsName;
	this.mounted = false;
}

ExportPrivateKeyModal.contextTypes = {
	t: PropTypes.func,
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(ExportPrivateKeyModal);

function getSnsName () {
	if (typeof global.ethereumProvider === 'undefined') return;
	const { selectedIdentity, metamask } = this.props;
	const { name, address } = selectedIdentity;
	const contractAddress = getSnsAddress(metamask.provider.type);
	let eth = new Eth(global.ethereumProvider);
	let newContract = new EthContract(eth);
	let contract = newContract(contractAbi);
	const myContract = contract.at(contractAddress);
	try {
		myContract.getAliasByAddr(address, (error, res) => {
			if (!this.mounted) {
				return;
			}
			if (res && res[0]) {
				this.setState({ snsName: res[0] });
			} else {
				this.setState({ snsName: name });
			}
		});
	} catch (e) {
		if (!this.mounted) {
			return;
		}
		this.setState({ snsName: name });
	}
}

ExportPrivateKeyModal.prototype.componentDidMount = function () {
	this.mounted = true;
	this.getSnsName();
};
ExportPrivateKeyModal.prototype.componentWillUnmount = function () {
	this.mounted = false;
};


ExportPrivateKeyModal.prototype.componentWillReceiveProps = function () {
	this.getSnsName();
};

ExportPrivateKeyModal.prototype.exportAccountAndGetPrivateKey = function (password, address) {
	const { exportAccount } = this.props;

	exportAccount(password, address)
	.then(privateKey => this.setState({ privateKey }));
};

ExportPrivateKeyModal.prototype.renderPasswordLabel = function (privateKey) {
	return h('span.private-key-password-label', privateKey
		? this.context.t('copyPrivateKey')
		: this.context.t('typePassword')
	);
};

ExportPrivateKeyModal.prototype.renderPasswordInput = function (privateKey) {
	const plainKey = privateKey && stripHexPrefix(privateKey);

	return privateKey
		? h(ReadOnlyInput, {
			wrapperClass: 'private-key-password-display-wrapper',
			inputClass: 'private-key-password-display-textarea',
			textarea: true,
			value: plainKey,
			onClick: () => copyToClipboard(plainKey),
		})
		: h('input.private-key-password-input', {
			type: 'password',
			onChange: event => this.setState({ password: event.target.value }),
		});
};

ExportPrivateKeyModal.prototype.renderButton = function (className, onClick, label) {
	return h('button', {
		className,
		onClick,
	}, label);
};

ExportPrivateKeyModal.prototype.renderButtons = function (privateKey, password, address, hideModal) {
	return h('div.export-private-key-buttons', {}, [
		!privateKey && this.renderButton(
			'btn-default btn--large export-private-key__button export-private-key__button--cancel',
			() => hideModal(),
			'Cancel'
		),

		(privateKey
				? this.renderButton('btn-primary btn--large export-private-key__button', () => hideModal(), this.context.t('done'))
				: this.renderButton('btn-primary btn--large export-private-key__button', () => this.exportAccountAndGetPrivateKey(this.state.password, address), this.context.t('confirm'))
		),

	]);
};

ExportPrivateKeyModal.prototype.render = function () {
	const {
		selectedIdentity,
		warning,
		showAccountDetailModal,
		hideModal,
		previousModalState,
	} = this.props;
	const { name, address } = selectedIdentity;

	const { privateKey, snsName } = this.state;

	return h(AccountModalContainer, {
		showBackButton: previousModalState === 'ACCOUNT_DETAILS',
		backButtonAction: () => showAccountDetailModal(),
	}, [

		h('span.account-name', snsName || name),

		h(ReadOnlyInput, {
			wrapperClass: 'ellip-address-wrapper',
			inputClass: 'qr-ellip-address ellip-address',
			value: checksumAddress(address),
		}),

		h('div.account-modal-divider'),

		h('span.modal-body-title', this.context.t('showPrivateKeys')),

		h('div.private-key-password', {}, [
			this.renderPasswordLabel(privateKey),

			this.renderPasswordInput(privateKey),

			!warning ? null : h('span.private-key-password-error', warning),
		]),

		h('div.private-key-password-warning', this.context.t('privateKeyWarning')),

		this.renderButtons(privateKey, this.state.password, address, hideModal),

	]);
};
