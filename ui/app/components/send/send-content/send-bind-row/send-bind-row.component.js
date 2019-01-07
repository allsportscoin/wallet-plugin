import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SendRowWrapper from '../send-row-wrapper/';
import { contractAbi } from '../../../../snsAbi';
import Web3 from 'web3';
import ReadOnlyInput from '../../../readonly-input';
import getProvider from '../../../../../lib/getProvider';
import getSnsAddress from '../../../../../lib/getSnsAddress';

export default class SendBindRow extends Component {

	static propTypes = {};

	static contextTypes = {
		t: PropTypes.func,
	};

	componentWillMount () {
		const { selectedIdentity, bindValue, updateSendHexData, metamask } = this.props;
		const { address } = selectedIdentity;
		let web3 = new Web3(new Web3.providers.HttpProvider(getProvider(metamask.provider.rpcTarget, metamask.provider.type)));
		const contractAddress = getSnsAddress(metamask.provider.type);
		const contract = {};
		contract.abi = contractAbi;
		contract.myContract = web3.eth.contract(contractAbi).at(contractAddress);
		contract.web3 = web3;
		contract.contractAddress = contractAddress;
		try {
			let data = contract.myContract.setAlias.getData(bindValue, address);
			updateSendHexData(data);
		} catch (e) {
			updateSendHexData(null);
		}
	};

	render () {
		const { bindValue } = this.props;
		return (
			<SendRowWrapper label={ `${this.context.t('bind')}:` }>
				<ReadOnlyInput value={ bindValue }
				               wrapperClass='read-only-wrapper'
				               inputClass='read-only-input'
				/>
			</SendRowWrapper>
		);
	}

}

