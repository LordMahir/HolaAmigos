const Sensor = artifacts.require("Sensor");
module.exports = async function (deployer) {
  await deployer.deploy(Sensor);
};

