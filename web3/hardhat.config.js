/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.9",
        defaultNetwork: "sepolia",
        networks: {
            hardhat: {}, //empty config
            sepolia: {
                url: "https://rpc.sepolia.dev", //the copied rpc
                accounts: [`0x${process.env.PRIVATE_KEY}`], //array of addresses
            },
        },
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};
