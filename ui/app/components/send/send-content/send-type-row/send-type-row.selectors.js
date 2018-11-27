const selectors = {
	getTypeDropdownOpen,
	getSendType
}

function getTypeDropdownOpen (state) {
	console.log('state3', state);
	return state.send.typeDropdownOpen
}
function getSendType (state) {
	console.log('state4', state);
	return state.send.type
}
module.exports = selectors