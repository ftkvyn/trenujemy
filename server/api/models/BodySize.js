module.exports = {
	attributes: {
		user:{
			model:'User',
			required: true
		},
		neck:{
			type:'number',columnType:'integer',
			defaultsTo:0
		},
		shoulder:{
			type:'number',columnType:'integer',
			defaultsTo:0
		},
		forearm:{
			type:'number',columnType:'integer',
			defaultsTo:0
		},
		wrist:{
			type:'number',columnType:'integer',
			defaultsTo:0
		},
		chest:{
			type:'number',columnType:'integer',
			defaultsTo:0
		},
		waist:{
			type:'number',columnType:'integer',
			defaultsTo:0
		},
		hips:{
			type:'number',columnType:'integer',
			defaultsTo:0
		},
		thigh:{
			type:'number',columnType:'integer',
			defaultsTo:0
		},
		shin:{
			type:'number',columnType:'integer',
			defaultsTo:0
		}
	}
}