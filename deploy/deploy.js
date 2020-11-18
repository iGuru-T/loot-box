const debug = require('debug')('loot-box:deploy.js')
const { deploy1820 } = require('deploy-eip-1820')

module.exports = async (buidler) => {
  const { getNamedAccounts, deployments } = buidler
  const { deploy } = deployments  
  const { deployer } = await getNamedAccounts()
  const signer = await ethers.provider.getSigner(deployer)

  const isTest = (await ethers.provider.getNetwork()).chainId == 31337;

  await deploy1820(signer)

  if(isTest){
    console.log("deploying mintable contracts")
    await deploy('ERC20Mintable',{
      from: deployer,
      skipIfAlreadyDeployed: true,
      args:  ['test', 'test']
    }
    )
    await deploy('ERC721Mintable',{
      from: deployer,
      skipIfAlreadyDeployed: true,
      args:  ['test', 'test', 'hello.com']
    }
    )
    await deploy('ERC1155Mintable',{
      from: deployer,
      skipIfAlreadyDeployed: true,
      args:  ["https://blah.com"]
    }
    )
    await deploy('ERC777Mintable',{
      from: deployer,
      skipIfAlreadyDeployed: true,
      args: ['test', 'test', []]
    }
    )
  }

  debug({ deployer })

  await deploy('LootBoxController', {
    from: deployer,
    skipIfAlreadyDeployed: true
  })

  await deploy('ERC721ControlledFactory', {
    from: deployer,
    skipIfAlreadyDeployed: true
  })

  await deploy('LootBoxPrizeStrategyListener', {
    from: deployer,
    skipIfAlreadyDeployed: true
  })

};
