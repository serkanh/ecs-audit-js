const AWS = require("aws-sdk");

/**
 *
 * @param {string} profile
 * @param {string} region
 */
const initEcsProfile = (profile, region) => {
	const creds = new AWS.SharedIniFileCredentials({
		profile
	});
	AWS.config.update({
		credentials: creds,
		region: region
	});
	return new AWS.ECS();
};

const ecs = initEcsProfile("HA", "us-east-1");

/**
 * List container instnaces of a ecs cluster ex:'dev'
 * @param {string} clusterName
 * @returns {{containerInstanceArns:Array,clusterName:string}}
 */
const listContainerInstances = async clusterName => {
	return new Promise((resolve, reject) => {
		const params = {
			cluster: clusterName
		};
		ecs.listContainerInstances(params, (err, data) => {
			if (err) reject(err);
			else resolve({
				containerInstanceArns: data.containerInstanceArns,
				clusterName: clusterName
			});
		});
	});
};

/**
 *
 * @param {Array} ecsInstances
 * @param {string} clusterName
 * @returns {object}
 */
const describeContainerInstances = async (containerInstances, clusterName) => {
	return new Promise((resolve, reject) => {
		const params = {
			containerInstances: containerInstances,
			cluster: clusterName
		}
		ecs.describeContainerInstances(params, (err, data) => {
			if (err) reject(err)
			else resolve(data.containerInstances)
		})
	})
}


const getRemainingResources = async (clusterName) => {
	const clusterInstances = await listContainerInstances(clusterName);
	const clusterIntancesDecription = await describeContainerInstances(clusterInstances.containerInstanceArns, clusterInstances.clusterName);
	for (const instance of clusterIntancesDecription) {
		console.log(`Remaining ecs instances resources in ${clusterName}`)
		console.log(`------------------------------------`)
		for (const resource of instance.remainingResources) {
			//console.log(resource)
			if (resource.name === 'CPU' || resource.name === 'MEMORY') {
				console.log(`${resource.name}: ${resource.integerValue}`)
			}
		}
	}
}

const getClusters = async () => {
	return new Promise((resolve, reject) => {
		const params = {};
		ecs.listClusters(params, (err, data) => {
			if (err) reject(err);
			else resolve(data.clusterArns);
		});
	});
};

const main = async () => {
	try {
		// const clusters = await getClusters();
		// const clusterInstances = await listContainerInstances("dev");
		// const clusterIntancesDecription = await describeContainerInstances(clusterInstances.containerInstanceArns, clusterInstances.clusterName);
		// console.log(clusters);
		//console.log(clusterInstances);
		//console.log(clusterIntancesDecription)
		await getRemainingResources('dev')
		//	return clusters;
	} catch (error) {
		console.log(error);
	}
};

main();