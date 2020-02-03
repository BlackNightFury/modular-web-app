module.exports = db => ({ 
		clearDatabase() {
			console.log('Clearing database');
			console.log(db);
			// console.log(process.env)
			// console.log(process.env.MWA_ACCOUNT)
			// console.log(process.env.MWA_ENVIRONMENT)
			return true;
		}
	})