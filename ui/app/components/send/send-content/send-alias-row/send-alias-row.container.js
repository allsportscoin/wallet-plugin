import { connect } from 'react-redux';
import SendAliasRow from './send-alias-row.component';
import { updateSendTo, updateSendAlias } from '../../../../actions';
import { updateSendErrors } from '../../../../ducks/send.duck';
import { getSendAlias } from '../../send.selectors';

export default connect(mapStateToProps, mapDispatchToProps)(SendAliasRow);

function mapStateToProps (state) {
	return {
		metamask: state.metamask,
		alias: getSendAlias(state)
	};
}

function mapDispatchToProps (dispatch) {
	return {
		updateSendAlias: (alias) => dispatch(updateSendAlias(alias)),
		updateSendTo: (to, nickname) => dispatch(updateSendTo(to, nickname)),
		updateSendToError: (toErrorObject) => {
			dispatch(updateSendErrors(toErrorObject));
		},
	};
}
