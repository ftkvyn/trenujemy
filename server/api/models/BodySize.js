module.exports = {
	attributes: {
		user:{
			model:'User',
			required: true
		},
		neck:{
			type:'integer',
			required: true,
			defaultsTo:0
		},
		shoulder:{
			type:'integer',
			required: true,
			defaultsTo:0
		},
		forearm:{
			type:'integer',
			required: true,
			defaultsTo:0
		},
		wrist:{
			type:'integer',
			required: true,
			defaultsTo:0
		},
		chest:{
			type:'integer',
			required: true,
			defaultsTo:0
		},
		waist:{
			type:'integer',
			required: true,
			defaultsTo:0
		},
		hips:{
			type:'integer',
			required: true,
			defaultsTo:0
		},
		thigh:{
			type:'integer',
			required: true,
			defaultsTo:0
		},
		shin:{
			type:'integer',
			required: true,
			defaultsTo:0
		}
	}
}