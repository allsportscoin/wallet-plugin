import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SendRowWrapper from '../send-row-wrapper/';
import TypeDropdown from './type-dropdown/';

export default class SendTypeRow extends Component {

	static propTypes = {
		closeTypeDropdown: PropTypes.func,
		openTypeDropdown: PropTypes.func,
		type: PropTypes.array,
		typeDropdownOpen: PropTypes.bool,
		updateSendType: PropTypes.func,
		selectedType: PropTypes.object
	};

	static contextTypes = {
		t: PropTypes.func,
	};

	async handleTypeChange (newType) {
		const { selectedType, updateSendType, updateSendAlias, updateSendTo, updateSendHexData,updateSendToError } = this.props;
		if (Number(selectedType.id) === Number(newType.id)) {
			return;
		}
		// updateSendAlias('');
		// updateSendTo('', '');
		updateSendHexData('');
		updateSendType(newType);
		// updateSendToError({to: null});

	}

	render () {
		const {
			closeTypeDropdown,
			openTypeDropdown,
			type,
			selectedType,
			typeDropdownOpen,
			isBind
		} = this.props;
		return (
			<SendRowWrapper label={ `${this.context.t('type')}:` }>
				<TypeDropdown
					type={ type }
					closeDropdown={ () => closeTypeDropdown() }
					openDropdown={ () => openTypeDropdown() }
					dropdownOpen={ typeDropdownOpen }
					onSelect={ newType => this.handleTypeChange(newType) }
					selectedType={ selectedType }
					isBind={ isBind }
				/>
			</SendRowWrapper>
		);
	}

}
