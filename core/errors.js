class CoreError extends Error {
	constructor(message, code, status, data) {
		super(message);
		this.code = code;
		this.status = status;
		this.data = data;
	}
}

// CoreError example
exports.InvalidParameter = (param, data) => new CoreError(`Invalid parameter '${param}'`, 'E_INVALID_PARAM', 400, data);
exports.InvalidId = (data) => new CoreError(`Invalid id`, 'E_INVALID_ID', 400, data);
exports.InvalidEmail = (data) => new CoreError(`Invalid email`, 'E_INVALID_EMAIL', 400, data);
exports.InvalidPersonName = (data) => new CoreError(`Invalid person name`, 'E_INVALID_PERSON_NAME', 400, data);
exports.DuplicatedEmail = (data) => new CoreError(`This email is already in use`, 'E_DUPLICATED_EMAIL', 400, data);
