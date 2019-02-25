const AWS = require('aws-sdk')



//specify profile and region that command will be executed against
const initEcsProfile = (profile,region) => {
  const creds = new AWS.SharedIniFileCredentials({
    profile,
  });
  AWS.config.update({
    credentials: creds,
    region: 'us-east-1',
  });
  return new AWS.ECS();
};


const getClusters = async () => {
	const ecs = await initEcsProfile('default','us-east-1')
	return new Promise((resolve,reject)=>{
				const params = {}
				ecs.listClusters(params, (err, data) => {
			    if (err) reject(err);
			    else resolve(data.clusterArns);
			  });
	})
}

const main = async () => {
	try {
		const clusters = await getClusters()
		console.log(clusters)
		return clusters
	} catch (error) {
		console.log(error)
	}
}

main()