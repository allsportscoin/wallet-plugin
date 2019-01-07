import { connect } from 'react-redux';

import FromDropdown  from './from-dropdown.component'

export default connect(mapStateToProps, mapDispatchToProps)(FromDropdown);

function mapStateToProps (state) {
	return {
		metamask: state.metamask,
	};
}

function mapDispatchToProps (dispatch) {
	return {};
}
