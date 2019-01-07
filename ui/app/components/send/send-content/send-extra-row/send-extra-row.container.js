import { connect } from 'react-redux';
import {
	updateExtraData,
} from '../../../../actions';
import SendExtraRow from './send-extra-row.component';

export default connect(mapStateToProps, mapDispatchToProps)(SendExtraRow);

function mapStateToProps (state) {
	return {
		extra: state.metamask.send.extra,
	};
}

function mapDispatchToProps (dispatch) {
	return {
		updateExtraData (data) {
			return dispatch(updateExtraData(data));
		},
	};
}
