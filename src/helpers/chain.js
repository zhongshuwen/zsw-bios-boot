const axios= require("axios");
const { parseAuth } = require("./misc");

async function activateFeature(api, authorization, featureDigest){

  const auth  = parseAuth(authorization);
  const trx={
    actions: [
      {
        account: 'zswhq',
        name: 'activate',
        authorization:auth,
        data: {
          feature_digest: featureDigest,
        },
      },
    ],
  }

  const result = await api.transact(trx,
  {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result;
}
async function producerPreactivateFeatures(apiURL, featuresToPreactivate){
  const fullURL = apiURL+"/v1/producer/schedule_protocol_feature_activations";
  const postData = {
    protocol_features_to_activate: featuresToPreactivate,
  };
  const result = await axios({
    method: 'post',
    url: fullURL,
    responseType: 'json',
    data: postData,
  });
  
  return result;
}



module.exports = {
  activateFeature,
  producerPreactivateFeatures,

}