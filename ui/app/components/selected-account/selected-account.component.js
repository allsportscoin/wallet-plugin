import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copyToClipboard from 'copy-to-clipboard';

import { addressSlicer } from '../../util';
import { contractAbi } from '../../snsAbi';
import getSnsAddress from '../../../lib/getSnsAddress';

const Tooltip = require('../tooltip-v2.js');
const Eth = require('ethjs-query');
const EthContract = require('ethjs-contract');

class SelectedAccount extends Component {
	state = {
		copied: false,
		snsName: '',
		isLogoShow: false
	};
	mounted = false;

	static contextTypes = {
		t: PropTypes.func,
	};

	static propTypes = {
		selectedAddress: PropTypes.string,
		selectedIdentity: PropTypes.object,
	};

	componentWillReceiveProps () {
		this.getSnsName();
	}

	componentDidMount () {
		this.mounted = true;
		this.getSnsName();
	};

	componentWillUnmount () {
		this.mounted = false;
	};

	getSnsName () {
		if (typeof global.ethereumProvider === 'undefined') return;
		const { selectedAddress, selectedIdentity, metamask } = this.props;
		const { name } = selectedIdentity;
		const contractAddress = getSnsAddress(metamask.provider.type);
		let eth = new Eth(global.ethereumProvider);
		let newContract = new EthContract(eth);
		let contract = newContract(contractAbi);
		const myContract = contract.at(contractAddress);
		try {
			myContract.getAliasByAddr(selectedAddress, (error, res) => {
				if (!this.mounted) {
					return;
				}
				if (res && res[0]) {
					this.setState({ snsName: res[0], isLogoShow: true });
				} else {
					this.setState({ snsName: name, isLogoShow: false });
				}
			});
		} catch (e) {
			if (!this.mounted) {
				return;
			}
			this.setState({ snsName: name, isLogoShow: false });
		}
	}

	render () {
		const { t } = this.context;
		const { selectedAddress } = this.props;
		const { snsName, isLogoShow } = this.state;
		return (
			<div className="selected-account">
				<Tooltip
					position="bottom"
					title={ this.state.copied ? t('copiedExclamation') : t('copyToClipboard') }
				>
					<div
						className="selected-account__clickable"
						onClick={ () => {
							this.setState({ copied: true });
							setTimeout(() => this.setState({ copied: false }), 3000);
							copyToClipboard(selectedAddress);
						} }
					>
						<div className="selected-account__name">
							{ snsName }
							{
								isLogoShow ? <img src="images/renz.png" alt=""
								                  className="selected-account__alias__logo" /> : null
							}
						</div>
						<div className="selected-account__address">
							{ addressSlicer(selectedAddress) }
						</div>
					</div>
				</Tooltip>
			</div>
		);
	}
}

export default SelectedAccount;
