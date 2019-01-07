import { contractAbi } from '../../snsAbi';
import getSnsAddress from '../../../lib/getSnsAddress';

const Component = require('react').Component;
const PropTypes = require('prop-types');
const h = require('react-hyperscript');
const inherits = require('util').inherits;
const connect = require('react-redux').connect;
const actions = require('../../actions');
const AccountModalContainer = require('./account-modal-container');
const { getSelectedIdentity } = require('../../selectors');
const genAccountLink = require('../../../lib/account-link.js');
const QrView = require('../qr-code');
const EditableLabel = require('../editable-label');

const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');

function mapStateToProps (state) {
	return {
		metamask: state.metamask,
		network: state.metamask.network,
		selectedIdentity: getSelectedIdentity(state),
		keyrings: state.metamask.keyrings,
	};
}

function mapDispatchToProps (dispatch) {
	return {
		// Is this supposed to be used somewhere?
		showQrView: (selected, identity) => dispatch(actions.showQrView(selected, identity)),
		showExportPrivateKeyModal: () => {
			dispatch(actions.showModal({ name: 'EXPORT_PRIVATE_KEY' }));
		},
		hideModal: () => dispatch(actions.hideModal()),
		setAccountLabel: (address, label, snsName) => dispatch(actions.setAccountLabel(address, label, snsName)),
	};
}

inherits(AccountDetailsModal, Component);

function AccountDetailsModal () {
	Component.call(this);
	this.state = {
		snsName: '',
		isBindsns: false
	};
	this.getSnsName = getSnsName;
	this.mounted = false;
}

AccountDetailsModal.contextTypes = {
	t: PropTypes.func,
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(AccountDetailsModal);

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
				this.setState({ snsName: res[0], isBindsns: true });
			} else {
				this.setState({ snsName: name, isBindsns: false });
			}
		});
	} catch (e) {
		if (!this.mounted) {
			return;
		}
		this.setState({ snsName: name, isBindsns: false });
	}
}

AccountDetailsModal.prototype.componentDidMount = function () {
	this.mounted = true;
	this.getSnsName();
};
AccountDetailsModal.prototype.componentWillUnmount = function () {
	this.mounted = false;
};

AccountDetailsModal.prototype.componentWillReceiveProps = function () {
	this.getSnsName();
};

// Not yet pixel perfect todos:
// fonts of qr-header

AccountDetailsModal.prototype.render = function () {
	const {
		selectedIdentity,
		network,
		showExportPrivateKeyModal,
		setAccountLabel,
		keyrings,
	} = this.props;
	const { name, address } = selectedIdentity;
	const { snsName, isBindsns } = this.state;

	const keyring = keyrings.find((kr) => {
		return kr.accounts.includes(address);
	});

	let exportPrivateKeyFeatureEnabled = true;
	// This feature is disabled for hardware wallets
	if (keyring.type.search('Hardware') !== -1) {
		exportPrivateKeyFeatureEnabled = false;
	}

	return h(AccountModalContainer, {}, [
		isBindsns ? h('span.account-name', {
			style: {},
		}, [
			snsName,
			h('img.bindSuccess', {
				src: 'images/renz.png',
				style: {
					width: '20px',
					display: 'inline-block',
					position: 'relative',
					top: '3px'
				}
			}),
		]) : h(EditableLabel, {
			className: 'account-modal__name',
			defaultValue: name,
			onSubmit: label => setAccountLabel(address, label, snsName),
		}),

		h(QrView, {
			Qr: {
				data: address,
			},
		}),

		h('div.account-modal-divider'),

		h('button.btn-primary.account-modal__button', {
			onClick: () => global.platform.openWindow({ url: `http://test-socscan.allsportschain.com/#/account?address=${address}` }),
		}, this.context.t('etherscanView')),

		// Holding on redesign for Export Private Key functionality
		exportPrivateKeyFeatureEnabled ? h('button.btn-primary.account-modal__button', {
			onClick: () => showExportPrivateKeyModal(),
		}, this.context.t('exportPrivateKey')) : null,

	]);
};
