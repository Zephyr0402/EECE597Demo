const GobangUserProfile = artifacts.require("GobangUserProfile");

module.exports = function(deployer) {
  deployer.deploy(GobangUserProfile);
};
