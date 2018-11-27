import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageContainerContent from '../../page-container/page-container-content.component';
import SendAmountRow from './send-amount-row/';
import SendFromRow from './send-from-row/';
import SendGasRow from './send-gas-row/';
import SendHexDataRow from './send-hex-data-row';
import SendToRow from './send-to-row/';
import SendType from './send-type-row';

export default class SendContent extends Component {

	static propTypes = {
		updateGas: PropTypes.func,
		scanQrCode: PropTypes.func,
		selectType: PropTypes.ojbect
	};

	render () {
		const { selectType } = this.props;
		const { id } = selectType;
		return (
			<PageContainerContent>
				<div className="send-v2__form">
					<SendType />
					<SendFromRow />
					{
						Number(id) === 1 || Number(id) === 2 ? null : (
							<SendToRow
								updateGas={ (updateData) => this.props.updateGas(updateData) }
								scanQrCode={ _ => this.props.scanQrCode() }
							/>
						)
					}
					{
						Number(id) !== 0 ? null : (
							<SendAmountRow updateGas={ (updateData) => this.props.updateGas(updateData) } />
						)
					}
					<SendGasRow />
					<SendHexDataRow />
				</div>
			</PageContainerContent>
		);
	}

}
