const getProvider = (rpcTarget, type) => {
	switch (type) {
		case 'mainnet':
			return 'http://test-socscan.allsportschain.com/v1/jsonrpc/mainnet';
		case 'rinkeby':
			return 'http://test-socscan.allsportschain.com/v1/jsonrpc/mainnet';
		case 'rpc':
			return `${rpcTarget}`;
		default:
			return 'http://localhost:8545/';
	}
};
module.exports = getProvider;