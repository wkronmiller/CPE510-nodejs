const FormData = require('form-data');
const rp = require('request-promise-native');
const crypto = require('crypto');

const {
  USERNAME,
  PASSWORD,
  TP_LINK_HOST: host
} = process.env;

const agentOptions = {
  rejectUnauthorized: false,
  ciphers: 'ALL',
  secureProtocol: 'TLSv1_method'
};

const jar = rp.jar();

const headers = {
  'Referer': `https://${host}`,
};

/**
 * MD5-Encode String
 * This replicates the "encode" functionality
 * of the original TP-Link software.
 */
function encode(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * Send encoded username/password/nonce to server
 * which will cause the cookie ("COOKIE=[nonce]") to
 * be authenticated.
 */
async function login() {
  const loginUrl = `https://${host}/data/version.json`;
  await rp(loginUrl, { agentOptions, jar });

  // Extract nonce from cookie jar
  const nonce = jar.getCookieString(loginUrl).match(/COOKIE=([^;]+)/)[1];

  // Replicate TP-Link 'encoded" generator
  const encoded = USERNAME + ':' + 
    encode(encode(PASSWORD).toUpperCase() + ':' + nonce).toUpperCase();

  // Authenticate
  const loginRes = await rp.post(loginUrl, {
    jar, agentOptions,
    form: {
      encoded,
      nonce,
    },
    json: true,
  })

  if(loginRes.status !== 0) {
    console.error('Login failed', { loginRes, encoded, nonce, });
    throw 'Login failed';
  }

}

async function getInfo() {
  const { success, data, ...rest } = await rp(`https://${host}/data/info.json`, { 
    agentOptions, jar, headers, json: true,
  });
  if(!success) {
    console.error({ success, data, rest })
    throw 'Failed to fetch info';
  }
  return data;
}


login().then(getInfo).then(console.log)

