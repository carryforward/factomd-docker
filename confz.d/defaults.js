const {get, isArray, mergeAllWith} = require('lodash/fp')

const mergeValues = mergeAllWith((objValue, srcValue) => isArray(objValue) || isArray(srcValue) ? srcValue : undefined)

const GLOBAL_DEFAULTS = {
  startDelay: 0,
}

const NETWORK_DEFAULTS = {
  fct_community_test: {
    blockTime: 600,
    bootstrapIdentity: '8888882f5002ff95fce15d20ecb7e18ae6cc4d5849b372985d856b56e492ae0f',
    bootstrapKey: '58cfccaa48a101742845df3cecde6a9f38037030842d34d0eaa76867904705ae',
    identityChain: 'FA1E000000000000000000000000000000000000000000000000000000000000',
    oraclePublicKey: '58cfccaa48a101742845df3cecde6a9f38037030842d34d0eaa76867904705ae',
    p2pPort: 8110,
    p2pSeed: 'https://raw.githubusercontent.com/FactomProject/communitytestnet/master/seeds/testnetseeds.txt',
  },
}

const ROLE_DEFAULTS = {
  AUTHORITY: {
    startDelay: 600,
  },
}

const NETWORK_ROLE_DEFAULTS = {
  MAIN: {
    AUTHORITY: {
      p2pSpecialPeers: [
        '52.17.183.121:8108',
        '52.17.153.126:8108',
        '52.19.117.149:8108',
        '52.18.72.212:8108',
      ],
    }
  }
}

module.exports = ({network, role}) =>
  mergeValues([
    {},
    GLOBAL_DEFAULTS,
    get(network, NETWORK_DEFAULTS),
    get(role, ROLE_DEFAULTS),
    get(`${network}.${role}`, NETWORK_ROLE_DEFAULTS)
  ])
