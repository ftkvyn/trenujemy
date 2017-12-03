module.exports = {
	attributes: {
		user:{
			model:'User',
			required: true
		},
		neck:{
			type:'integer',
			required: true,
			defaultsTo:38
		},
		shoulder:{
			type:'integer',
			required: true,
			defaultsTo:36
		},
		forearm:{
			type:'integer',
			required: true,
			defaultsTo:27
		},
		wrist:{
			type:'integer',
			required: true,
			defaultsTo:17
		},
		chest:{
			type:'integer',
			required: true,
			defaultsTo:103
		},
		waist:{
			type:'integer',
			required: true,
			defaultsTo:82
		},
		hips:{
			type:'integer',
			required: true,
			defaultsTo:91
		},
		thigh:{
			type:'integer',
			required: true,
			defaultsTo:52
		},
		shin:{
			type:'integer',
			required: true,
			defaultsTo:37
		}
	}
}