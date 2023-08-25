const MemoryGameProfile = artifacts.require("MemoryGameProfile");

module.exports = function(deployer) {
  deployer.deploy(MemoryGameProfile);
};
