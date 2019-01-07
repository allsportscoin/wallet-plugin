import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AccountListItem from '../../../account-list-item/';
import SendDropdownList from '../../send-dropdown-list/';
import getSnsAddress from '../../../../../../lib/getSnsAddress';
import { contractAbi } from '../../../../../snsAbi';

const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');

export default class FromDropdown extends Component {

	static propTypes = {
		accounts: PropTypes.array,
		closeDropdown: PropTypes.func,
		dropdownOpen: PropTypes.bool,
		onSelect: PropTypes.func,
		openDropdown: PropTypes.func,
		selectedAccount: PropTypes.object,
	};

	static contextTypes = {
		t: PropTypes.func,
	};

	constructor (props) {
		super(props);

		this.state = {
			accounts: [],
			selectedAccount: {}
		};
		this.mounted = false;
	}

	componentWillMount () {
		const { accounts, selectedAccount } = this.props;
		this.setState({
			accounts, selectedAccount
		});
	};
	componentWillReceiveProps() {
		this.createContract();
	}

	componentDidMount () {
		this.mounted = true;
		this.createContract();
	};

	componentWillUnmount () {
		this.mounted = false;
	};

	createContract () {
		const { accounts, metamask } = this.props;
		let selectedAccount = this.props.selectedAccount;
		const contractAddress = getSnsAddress(metamask.provider.type);
		let eth = new Eth(global.ethereumProvider);
		let newContract = new EthContract(eth);
		let contract = newContract(contractAbi);
		const myContract = contract.at(contractAddress);
		let _this = this;
		try {
			myContract.getAliasByAddr(selectedAccount.address, function (error, res) {
					if (!_this.mounted) {
						return;
					}
					if (error) {
						selectedAccount = { ...selectedAccount, snsName: '' };
					}
					if (res) {
						selectedAccount = { ...selectedAccount, snsName: res && res[0] };
					}
					_this.setState({
						selectedAccount
					});
				}
			);
		} catch (e) {
			if (!_this.mounted) {
				return;
			}
			selectedAccount = { ...selectedAccount, snsName: '' };
			_this.setState({
				selectedAccount
			});
		}
		accounts.map((item, index) => {
				try {
					myContract.getAliasByAddr(item.address, function (error, res) {
						if (!_this.mounted) {
							return;
						}
							if (error) {
								accounts[index] = { ...item, snsName: '' };
							}
							if (res) {
								accounts[index] = { ...item, snsName: res && res[0] };
							}
							_this.setState({
								accounts
							});
						}
					);
				} catch (e) {
					if (!_this.mounted) {
						return;
					}
					accounts[index] = { ...item, snsName: '' };
					_this.setState({
						accounts
					});
				}

			}
		);
	};

	render () {
		const {
			closeDropdown,
			dropdownOpen,
			openDropdown,
			onSelect,
		} = this.props;

		const { accounts, selectedAccount } = this.state;
		return <div className="send-v2__from-dropdown">
			<AccountListItem
				account={ selectedAccount }
				handleClick={ openDropdown }
				icon={ <i className={ `fa fa-caret-down fa-lg` } style={ { color: '#dedede' } } /> }
			/>
			{ dropdownOpen && <SendDropdownList
				accounts={ accounts }
				closeDropdown={ closeDropdown }
				onSelect={ onSelect }
				activeAddress={ selectedAccount.address }
			/> }
		</div>;
	}

}
