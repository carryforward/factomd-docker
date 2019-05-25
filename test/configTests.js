const test = require('ava')
const {decode} = require('ini')
const {random, times} = require('lodash/fp')
const matchAll = require('match-all')

const {getFileFromContainer} = require('./util')

const DEFAULT_CONFIG = {
  network: 'main',
}

const mergeConfig = config => ({
  ...DEFAULT_CONFIG,
  ...config,
})

const getOptions = async config => {
  const factomdConf = await getFileFromContainer('factomd.conf', mergeConfig(config))
  return decode(factomdConf).app
}

const getArgs = async config => {
  const startupScript = await getFileFromContainer('start.sh', mergeConfig(config))
  const regex = /-([a-zA-Z]+)=("?[^ \"]+"?)/g

  let match, args = {}
  while ((match = regex.exec(startupScript)) != null) {
    const [_, key, value] = match
    args[key] = value
  }
  return args
}


const randomInt = (min, max = min) => random(min === max ? 0 : min, max)

const randomSeconds = () => randomInt(0, 1000)

const randomPort = () => randomInt(1025, 65535)

const randomHexId = (len = 64) => times( () => random(0, 15).toString(16), len).join('')

const randomString = (len = 10) => times( () => random(10, 35).toString(36), len).join('')

const randomPem = () => {
  const name = randomString().toUpperCase()

  return `-----BEGIN ${name}-----
  ${randomHexId()}
  -----END ${name}-----`
}

console.log(randomPem())

const optTest = (yamlName, optionName, config, valueOverride) => test(`${yamlName} -> ${optionName}`, async t => {
  const options = await getOptions(config)
  t.is(valueOverride || config[yamlName].toString(), options[optionName].toString())
})

const argTest = (yamlName, argName, config, valueOverride) => test(`${yamlName} -> ${argName}`, async t => {
  const args = await getArgs(config)
  t.is(valueOverride || config[yamlName].toString(), args[argName])
})

optTest('apiPassword', 'FactomdRpcPass', {apiPassword: 'password', apiUser: 'username'})
optTest('apiPort', 'PortNumber', {apiPort: randomPort()})
optTest('apiUser', 'FactomdRpcUser', {apiPassword: 'password', apiUser: 'username'})
optTest('authorityServerPrivateKey', 'LocalServerPrivKey', {authorityServerPrivateKey: randomHexId(), authorityServerPublicKey: randomHexId()})
optTest('authorityServerPublicKey', 'LocalServerPublicKey', {authorityServerPrivateKey: randomHexId(), authorityServerPublicKey: randomHexId()})
optTest('brainSwapHeight', 'ChangeAcksHeight', {brainSwapHeight: randomInt(10000, 20000)})
argTest('broadcastNumber', 'broadcastnum', {broadcastNumber: randomInt(1, 10000)})
optTest('controlPanelMode', 'ControlPanelSetting', {controlPanelMode: 'disabled'})
optTest('controlPanelPort', 'ControlPanelPort', {controlPanelPort: randomPort()})
optTest('corsDomains', 'CorsDomains', {corsDomains: ['foo.com', 'bar.com']}, 'foo.com, bar.com')
optTest('customBootstrapIdentity', 'CustomBootstrapIdentity', {customBootstrapIdentity: randomHexId()})
optTest('customBootstrapKey', 'CustomBootstrapKey', {customBootstrapKey: randomHexId()})
optTest('customExchangeRateAuthorityPublicKey', 'ExchangeRateAuthorityPublicKey', {customExchangeRateAuthorityPublicKey: randomHexId()})
argTest('customNetworkId', 'customnet', {customNetworkId: randomString()})
optTest('customNetworkPort', 'CustomNetworkPort', {customNetworkPort: randomPort()})
optTest('customSeedUrl', 'CustomSeedURL', {customSeedUrl: 'http://foo.com'})
optTest('customSpecialPeers', 'CustomSpecialPeers', {customSpecialPeers: ['1.2.3.4:1025', '6.7.8.9:5000']}, '1.2.3.4:1025 6.7.8.9:5000')
optTest('directoryBlockInSeconds', 'DirectoryBlockInSeconds', {directoryBlockInSeconds: randomSeconds()})
optTest('fastBoot', 'FastBoot', {fastBoot: true})
argTest('faultTimeoutInSeconds', 'faulttimeout', {faultTimeoutInSeconds: randomSeconds()})
optTest('identityChainId', 'IdentityChainID', {identityChainId: randomHexId()})
optTest('localNetworkPort', 'LocalNetworkPort', {localNetworkPort: randomPort()})
optTest('localSeedUrl', 'LocalSeedURL', {localSeedUrl: 'http://foo.com'})
optTest('localSpecialPeers', 'LocalSpecialPeers', {localSpecialPeers: ['1.2.3.4:1025', '6.7.8.9:5000']}, '1.2.3.4:1025 6.7.8.9:5000')
argTest('logLevel', 'loglvl', {logLevel: 'panic'})
optTest('mainNetworkPort', 'MainNetworkPort', {mainNetworkPort: randomPort()})
optTest('mainSeedUrl', 'MainSeedURL', {mainSeedUrl: 'http://foo.com'})
optTest('mainSpecialPeers', 'MainSpecialPeers', {mainSpecialPeers: ['1.2.3.4:1025', '6.7.8.9:5000']}, '1.2.3.4:1025 6.7.8.9:5000')
optTest('network', 'Network', {network: 'test'}, 'TEST')
argTest('nodeName', 'nodename', {nodeName: randomString()})
argTest('specialPeersDialOnly', 'exclusive', {specialPeersDialOnly: true})
argTest('specialPeersOnly', 'exclusiveIn', {specialPeersOnly: true})
argTest('startDelayInSeconds', 'startdelay', {startDelayInSeconds: randomSeconds()})
optTest('testNetworkPort', 'TestNetworkPort', {testNetworkPort: randomPort()})
optTest('testSeedUrl', 'TestSeedURL', {testSeedUrl: 'http://foo.com'})
optTest('testSpecialPeers', 'TestSpecialPeers', {testSpecialPeers: ['1.2.3.4:1025', '6.7.8.9:5000']}, '1.2.3.4:1025 6.7.8.9:5000')
optTest('tlsEnabled', 'FactomdTlsEnabled', {tlsEnabled: false})
optTest('tlsPrivateKey', 'FactomdTlsPrivKey', {tlsPrivateKey: randomPem(), tlsPublicCert: randomPem()})
optTest('tlsPublicCert', 'FactomdTlsPublicCert', {tlsPrivateKey: randomPem(), tlsPublicCert: randomPem()})


