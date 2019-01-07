import { connect } from 'react-redux';
import { getSelectSendType } from '../../send.selectors.js';
import { getTypeDropdownOpen, getSendType } from './send-type-row.selectors.js';
import {
	updateSendType,
	updateSendAlias,
	updateSendTo,
	updateSendHexData,
	updateSendToError
} from '../../../../actions';
import { closeTypeDropdown, openTypeDropdown, updateSendErrors } from '../../../../ducks/send.duck';
import SendTypeRow from './send-type-row.component';

export default connect(mapStateToProps, mapDispatchToProps)(SendTypeRow);

function mapStateToProps (state) {
	return {
		type: getSendType(state),
		selectedType: getSelectSendType(state),
		typeDropdownOpen: getTypeDropdownOpen(state)
	};
}

function mapDispatchToProps (dispatch) {
	return {
		closeTypeDropdown: () => dispatch(closeTypeDropdown()),
		openTypeDropdown: () => dispatch(openTypeDropdown()),
		updateSendAlias: () => dispatch(updateSendAlias()),
		updateSendTo: () => dispatch(updateSendTo()),
		updateSendHexData: (data) => dispatch(updateSendHexData(data)),
		updateSendType: newType => dispatch(updateSendType(newType)),
		updateSendToError: (toErrorObject) => {
			dispatch(updateSendErrors(toErrorObject));
		},
	};
}
