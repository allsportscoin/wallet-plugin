const selectors = {
	getTypeDropdownOpen,
	getSendType
}

function getTypeDropdownOpen (state) {
	return state.send.typeDropdownOpen
}
function getSendType (state) {
	return state.send.type
}
module.exports = selectors