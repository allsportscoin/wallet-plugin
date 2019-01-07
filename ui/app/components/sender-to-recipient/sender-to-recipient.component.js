import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Identicon from '../identicon';
import Tooltip from '../tooltip-v2';
import copyToClipboard from 'copy-to-clipboard';
import { contractAbi } from '../../snsAbi';
import Web3 from 'web3';
import getProvider from '../../../lib/getProvider';
import getSnsAddress from '../../../lib/getSnsAddress';

export default class SenderToRecipient extends Component {
	static propTypes = {
		senderName: PropTypes.string,
		senderAddress: PropTypes.string,
		recipientName: PropTypes.string,
		recipientAddress: PropTypes.string,
		t: PropTypes.func,
	};

	static contextTypes = {
		t: PropTypes.func,
	};

	state = {
		senderAddressCopied: false,
		recipientAddressCopied: false,
		senderSnsName: '',
		recipientSnsName: ''
	};

	componentWillMount () {
		const { senderName, senderAddress, recipientName, recipientAddress, metamask } = this.props;
		let web3 = new Web3(new Web3.providers.HttpProvider(getProvider(metamask.provider.rpcTarget, metamask.provider.type)));
		const contractAddress = getSnsAddress(metamask.provider.type);
		const contract = {};
		contract.abi = contractAbi;
		contract.myContract = web3.eth.contract(contractAbi).at(contractAddress);
		contract.web3 = web3;
		contract.contractAddress = contractAddress;
		try {
			this.setState({
				senderSnsName: contract.myContract.getAliasByAddr(senderAddress),
			});
		} catch (e) {
			this.setState({
				senderSnsName: senderName,
			});
		}
		try {
			this.setState({
				recipientSnsName: contract.myContract.getAliasByAddr(recipientAddress)
			});
		} catch (e) {
			this.setState({
				recipientSnsName: recipientName
			});
		}
	};

	renderRecipientWithAddress () {
		const { t } = this.context;
		const { recipientName, recipientAddress } = this.props;
		const { recipientSnsName } = this.state;
		return (
			<div
				className="sender-to-recipient__recipient sender-to-recipient__recipient--with-address"
				onClick={ () => {
					this.setState({ recipientAddressCopied: true });
					copyToClipboard(recipientAddress);
				} }
			>
				<div className="sender-to-recipient__sender-icon">
					<Identicon
						address={ recipientAddress }
						diameter={ 24 }
					/>
				</div>
				<Tooltip
					position="bottom"
					title={ this.state.recipientAddressCopied ? t('copiedExclamation') : t('copyAddress') }
					wrapperClassName="sender-to-recipient__tooltip-wrapper"
					containerClassName="sender-to-recipient__tooltip-container"
					onHidden={ () => this.setState({ recipientAddressCopied: false }) }
				>
					<div className="sender-to-recipient__name sender-to-recipient__recipient-name">
						{ recipientSnsName|| recipientName || this.context.t('newContract') }
					</div>
				</Tooltip>
			</div>
		);
	}

	renderRecipientWithoutAddress () {
		return (
			<div className="sender-to-recipient__recipient">
				<i className="fa fa-file-text-o" />
				<div className="sender-to-recipient__name sender-to-recipient__recipient-name">
					{ this.context.t('newContract') }
				</div>
			</div>
		);
	}

	render () {
		const { t } = this.context;
		const { senderName, senderAddress, recipientAddress } = this.props;
		const { senderSnsName } = this.state;
		return (
			<div className="sender-to-recipient__container">
				<div
					className="sender-to-recipient__sender"
					onClick={ () => {
						this.setState({ senderAddressCopied: true });
						copyToClipboard(senderAddress);
					} }
				>
					<div className="sender-to-recipient__sender-icon">
						<Identicon
							address={ senderAddress }
							diameter={ 24 }
						/>
					</div>
					<Tooltip
						position="bottom"
						title={ this.state.senderAddressCopied ? t('copiedExclamation') : t('copyAddress') }
						wrapperClassName="sender-to-recipient__tooltip-wrapper"
						containerClassName="sender-to-recipient__tooltip-container"
						onHidden={ () => this.setState({ senderAddressCopied: false }) }
					>
						<div className="sender-to-recipient__name sender-to-recipient__sender-name">
							{ senderSnsName || senderName }
						</div>
					</Tooltip>
				</div>
				<div className="sender-to-recipient__arrow-container">
					<div className="sender-to-recipient__arrow-circle">
						<img
							height={ 15 }
							width={ 15 }
							src="./images/arrow-right.svg"
						/>
					</div>
				</div>
				{
					recipientAddress
						? this.renderRecipientWithAddress()
						: this.renderRecipientWithoutAddress()
				}
			</div>
		);
	}
}
