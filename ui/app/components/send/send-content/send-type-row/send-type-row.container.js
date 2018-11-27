import { connect } from 'react-redux';
import { getSelectSendType } from '../../send.selectors.js';
import { getTypeDropdownOpen, getSendType } from './send-type-row.selectors.js';
import { updateSendType } from '../../../../actions';
import { closeTypeDropdown, openTypeDropdown } from '../../../../ducks/send.duck';
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
		updateSendType: newType => dispatch(updateSendType(newType)),
	};
}
