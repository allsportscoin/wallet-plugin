const getSnsAddress = (type) => {
	switch (type) {
		case 'mainnet':
			return '0xaf3c93eeed2415e83544f2df07e9ee9027c71810';
		case 'rinkeby':
			return '0xaf3c93eeed2415e83544f2df07e9ee9027c71810';
		default:
			return '0xaf3c93eeed2415e83544f2df07e9ee9027c71810';
	}
};
module.exports = getSnsAddress;