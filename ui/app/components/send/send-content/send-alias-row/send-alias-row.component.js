import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SendRowWrapper from '../send-row-wrapper/';
import { contractAbi } from '../../../../snsAbi';
import Web3 from 'web3';
import { getToErrorObject } from '../send-to-row/send-to-row.utils';
import getProvider from '../../../../../lib/getProvider';
import getSnsAddress from '../../../../../lib/getSnsAddress';


export default class SendAliasRow extends Component {

	static propTypes = {};

	static contextTypes = {
		t: PropTypes.func,
	};

	constructor (props) {
		super(props);

		this.state = {
			snsName: ''
		};
	};

	componentWillMount () {

	};

	handleChange (e) {
		const { updateSendAlias } = this.props;
		this.setState({ snsName: e.target.value });
		updateSendAlias(e.target.value);
	}

	queryAddr () {
		const { metamask, updateSendTo, updateSendToError, updateGas } = this.props;
		const { snsName } = this.state;
		// let web3 = new Web3(new Web3.providers.HttpProvider(metamask.provider.rpcTarget));
		let web3 = new Web3(new Web3.providers.HttpProvider(getProvider(metamask.provider.rpcTarget, metamask.provider.type)));
		const contractAddress = getSnsAddress(metamask.provider.type);
		const contract = {};
		contract.abi = contractAbi;
		contract.myContract = web3.eth.contract(contractAbi).at(contractAddress);
		contract.web3 = web3;
		contract.contractAddress = contractAddress;
		try {
			let address = contract.myContract.getAddrByAlias(snsName);
			updateSendTo(address, '');
			const toErrorObject = getToErrorObject(address);
			updateSendToError(toErrorObject);
			if (toErrorObject.to === null) {
				updateGas({ to: address });
			}
		} catch (e) {
			updateSendTo('0x0000000000000000000000000000000000000000', '');
			const toErrorObject = getToErrorObject('0x0000000000000000000000000000000000000000');
			updateSendToError(toErrorObject);
		}
	}

	render () {
		const { alias } = this.props;
		return (
			<SendRowWrapper label={ `${this.context.t('alias')}:` }>
				<div className="alias-input-wrap">
					<input
						type="text"
						value={ alias }
						onChange={ this.handleChange.bind(this) }
						onBlur={ this.queryAddr.bind(this) }
						placeholder={ `${this.context.t('receiptNickName')}`}
					/>
				</div>
			</SendRowWrapper>
		);
	}
}

