import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SendRowWrapper from '../send-row-wrapper/';
import EnsInput from '../../../ens-input';
import { getToErrorObject } from './send-to-row.utils.js';

import ReadOnlyInput from '../../../readonly-input';
import { contractAbi } from '../../../../snsAbi';
import getSnsAddress from '../../../../../lib/getSnsAddress';
import getProvider from '../../../../../lib/getProvider';
import Web3 from 'web3';

const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');
const zeroAddress = '0x0000000000000000000000000000000000000000';

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

	constructor (props) {
		super(props);

		this.state = {
			defaultValue: '',
			contract: {},
			toAccounts: []
		};
		this.mounted = false;
	}

	componentWillMount () {
		const { updateSendTo, isBind, toAccounts, metamask } = this.props;
		this.setState({
			toAccounts
		});
		if ((Number(isBind) === 1)) {
			const defaultValue = getSnsAddress(metamask.provider.type);
			this.setState({ defaultValue });
			updateSendTo(defaultValue, '');
		}
	};

	componentWillReceiveProps () {
		this.createContract();
	};

	componentDidMount () {
		this.mounted = true;
		this.createContract();
	};

	componentWillUnmount () {
		this.mounted = false;
	};

	createContract () {
		const { metamask, toAccounts } = this.props;
		const contractAddress = getSnsAddress(metamask.provider.type);
		let eth = new Eth(global.ethereumProvider);
		let newContract = new EthContract(eth);
		let contract = newContract(contractAbi);
		const myContract = contract.at(contractAddress);
		if (this.mounted) {
			this.setState({ contract: myContract });
		}
		let _this = this;
		toAccounts.map((item, index) => {
			try {
				myContract.getAliasByAddr(item.address, function (error, res) {
						if (!_this.mounted) {
							return;
						}
						if (error) {
							toAccounts[index] = { ...item, snsName: '' };
							return;
						}
						if (res) {
							toAccounts[index] = { ...item, snsName: res && res[0] };
						}
						_this.setState({
							toAccounts
						});
					}
				);
			} catch (e) {
				if (!this.mounted) {
					return;
				}
				toAccounts[index] = { ...item, snsName: '' };
				_this.setState({
					toAccounts
				});
			}

		});
	}

	handleToChange (to, nickname = '', toError) {
		const { updateSendTo, updateSendToError, updateGas, updateSendAlias } = this.props;
		const { contract } = this.state;
		const toErrorObject = getToErrorObject(to, toError);
		updateSendTo(to, nickname);
		updateSendToError(toErrorObject);
		if (to && to.indexOf('0x') === 0 && toErrorObject.to === null) {
			updateGas({ to });
		}
		updateSendAlias('');
		if (to && to.indexOf('0x') === 0) {
			try {
				contract.getAliasByAddr(to, function (error, res) {
						if (error) {
							updateSendAlias('');
						}
						if (res) {
							updateSendAlias(res[0]);
						}
					}
				);

			} catch (e) {
				updateSendAlias('');
			}
		}
	}

	handleToBlur () {
		const { metamask, updateSendTo, updateSendToError, updateGas, updateSendAlias, to } = this.props;
		if ((to && to.indexOf('0x')) === 0 || !to) {
			return;
		}
		let web3 = new Web3(new Web3.providers.HttpProvider(getProvider(metamask.provider.rpcTarget, metamask.provider.type)));
		const contractAddress = getSnsAddress(metamask.provider.type);
		const contract = {};
		contract.abi = contractAbi;
		contract.myContract = web3.eth.contract(contractAbi).at(contractAddress);
		contract.web3 = web3;
		contract.contractAddress = contractAddress;
		try {
			let address = contract.myContract.getAddrByAlias(to);
			updateSendTo(address, '');
			const toErrorObject = getToErrorObject(address);
			updateSendToError(toErrorObject);
			if (toErrorObject.to === null) {
				updateGas({ to: address });
			}
			try {
				let name = contract.myContract.getAliasByAddr(address);
				if (name) {
					updateSendAlias(name);
				} else {
					updateSendAlias('');
				}
			}
			catch (e) {
				updateSendAlias('');
			}
		} catch (e) {
			updateSendTo(zeroAddress, '');
			const toErrorObject = getToErrorObject(zeroAddress);
			updateSendToError(toErrorObject);
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
			toDropdownOpen,
			isBind,
			alias
		} = this.props;
		const { id } = selectType;
		const { defaultValue, toAccounts } = this.state;
		let label = 'to';
		if ((Number(id) === 3 || Number(id) === 4)) {
			label = 'candidate';
		}
		if ((Number(isBind) === 1 && Number(id) === 0)) {
			label = 'socResolver';
		}
		return (
			<SendRowWrapper
				errorType={ 'to' }
				label={ `${this.context.t(label)}:` }
				showError={ inError }
			>
				{
					(Number(isBind) === 1) ?
						<ReadOnlyInput value={ defaultValue }
						               wrapperClass='read-only-wrapper'
						               inputClass='read-only-input'
						/> :
						<div className="send-to-wrap">
							<EnsInput
								scanQrCode={ _ => this.props.scanQrCode() }
								accounts={ toAccounts }
								closeDropdown={ () => closeToDropdown() }
								dropdownOpen={ toDropdownOpen }
								inError={ inError }
								name={ 'address' }
								network={ network }
								onChange={ ({ toAddress, nickname, toError }) => this.handleToChange(toAddress, nickname, toError) }
								onBlur={ (toAddress) => this.handleToBlur(toAddress) }
								openDropdown={ (toAddress) => openToDropdown(toAddress) }
								placeholder={ this.context.t('recipientAddress') }
								to={ to }
							/>
							<div className="alias-name">{ alias }</div>
						</div>

				}

			</SendRowWrapper>
		);
	}

}
