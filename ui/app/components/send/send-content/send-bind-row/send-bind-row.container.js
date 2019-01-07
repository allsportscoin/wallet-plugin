import { connect } from 'react-redux';
import SendBindRow from './send-bind-row.component';
import { updateSendHexData } from '../../../../actions';
const { getSelectedIdentity } = require('../../../../selectors');

export default connect(mapStateToProps, mapDispatchToProps)(SendBindRow);


function mapStateToProps (state) {
	return {
		selectedIdentity: getSelectedIdentity(state),
		metamask: state.metamask,
	};
}
function mapDispatchToProps (dispatch) {
	return {
		updateSendHexData (data) {
			return dispatch(updateSendHexData(data))
		},
	}
}
