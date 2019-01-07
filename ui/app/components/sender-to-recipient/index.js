import { connect } from 'react-redux';
import SenderToRecipient from './sender-to-recipient.component';

export default connect(mapStateToProps, mapDispatchToProps)(SenderToRecipient);

function mapStateToProps (state) {
	return {
		metamask: state.metamask,
	};
}

function mapDispatchToProps (dispatch) {
	return {};
}
