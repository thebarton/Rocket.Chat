export const API = {
	delete(endpoint, params) {
		return API._jqueryCall('DELETE', endpoint, params);
	},

	get(endpoint, params) {
		return API._jqueryCall('GET', endpoint, params);
	},

	post(endpoint, params, body) {
		if (!body) {
			body = params;
			params = {};
		}

		return API._jqueryCall('POST', endpoint, params, body);
	},

	upload(endpoint, params, formData) {
		if (!formData) {
			formData = params;
			params = {};
		}

		return API._jqueryFormDataCall(endpoint, params, formData);
	},

	_generateQueryFromParams(params) {
		let query = '';
		if (params && typeof params === 'object') {
			Object.keys(params).forEach((key) => {
				query += query === '' ? '?' : '&';

				query += `${ key }=${ params[key] }`;
			});
		}

		return query;
	},

	_jqueryCall(method, endpoint, params, body) {
		const query = API._generateQueryFromParams(params);

		return new Promise(function _rlRestApiGet(resolve, reject) {
			jQuery.ajax({
				method,
				url: `${ document.baseURI }api/${ endpoint }${ query }`,
				headers: {
					'Content-Type': 'application/json',
					'X-User-Id': localStorage['Meteor.userId'],
					'X-Auth-Token': localStorage['Meteor.loginToken'],
				},
				data: JSON.stringify(body),
				success: function _rlGetSuccess(result) {
					resolve(result);
				},
				error: function _rlGetFailure(xhr, status, errorThrown) {
					const error = new Error(errorThrown);
					error.xhr = xhr;
					reject(error);
				},
			});
		});
	},

	_jqueryFormDataCall(endpoint, params, formData) {
		const query = API._generateQueryFromParams(params);

		if (!(formData instanceof FormData)) {
			throw new Error('The formData parameter MUST be an instance of the FormData class.');
		}

		return new Promise(function _jqueryFormDataPromise(resolve, reject) {
			jQuery.ajax({
				url: `${ document.baseURI }api/${ endpoint }${ query }`,
				headers: {
					'X-User-Id': localStorage['Meteor.userId'],
					'X-Auth-Token': localStorage['Meteor.loginToken'],
				},
				data: formData,
				processData: false,
				contentType: false,
				type: 'POST',
				success: function _jqueryFormDataSuccess(result) {
					resolve(result);
				},
				error: function _jqueryFormDataError(xhr, status, errorThrown) {
					reject(new Error(errorThrown));
				},
			});
		});
	},

	v1: {
		delete(endpoint, params) {
			return API.delete(`v1/${ endpoint }`, params);
		},

		get(endpoint, params) {
			return API.get(`v1/${ endpoint }`, params);
		},

		post(endpoint, params, body) {
			return API.post(`v1/${ endpoint }`, params, body);
		},

		upload(endpoint, params, formData) {
			return API.upload(`v1/${ endpoint }`, params, formData);
		},
	},
};
