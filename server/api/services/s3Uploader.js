const AWS = require('aws-sdk');
const fs = require('fs');
const Q = require('q');
const uuidv4 = require('uuid/v4');
const path = require('path');
const bucketName = 'trenujemy';

AWS.config.update({accessKeyId: process.env.TRENUJEMY_AWS_ID, 
	secretAccessKey: process.env.TRENUJEMY_AWS_KEY});
AWS.config.region = 'eu-central-1';
const envPath = process.env.TRENUJEMY_ENV;
const imgRoot = '/img/';
const filesRoot = '/files/';
const s3 = new AWS.S3();

///params : {
///		name: STRING,
///		originalName: STRING,
///		fileData: STRING, path to file	
///  }
function upload(params){
	var deferred = Q.defer();
	var fileBuffer = fs.readFileSync(params.fileData);
	var root = imgRoot;
	if(params.isFile){
		root = filesRoot;
	}
	if(params.root){
		root = '/' + params.root + '/';
	}
	var uniqueId = uuidv4();
	var ext = path.parse(params.originalName).ext; 
    //var filename = path.parse(params.originalName).name;
	s3.upload({
	    ACL: params.access,
	    Bucket: bucketName,
	    Key: envPath + root + params.name + '_' + uniqueId + ext,
	    Body: fileBuffer,
	    ContentType: params.type,
	  }, function(error, response) {
	    if(error){
	    	console.error(error);
	    	deferred.reject(new Error(error));
	    }else{
	    	deferred.resolve({url: response.Location, key: response.key});
		}
	  });
	return deferred.promise;
}

exports.uploadFile = function(params){
	params = params || {};
	params.access = 'private';
	params.isFile = true;
	return upload(params);
}


exports.uploadImg = function (params) {
	params = params || {};
	params.access = 'public-read';
	params.isImg = true;
	return upload(params);
}

exports.getFileUrl = function(key){
	const signedUrlExpireSeconds = 60 * 5;

	const url = s3.getSignedUrl('getObject', {
	    Bucket: bucketName,
	    Key: key,
	    Expires: signedUrlExpireSeconds
	});
	return url;
}