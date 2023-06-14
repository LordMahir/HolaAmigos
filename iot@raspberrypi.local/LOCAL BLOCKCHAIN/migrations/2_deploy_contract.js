const Store = artifacts.require("Store");
module.exports = async function (deployer) {
  await deployer.deploy(Store);
};

