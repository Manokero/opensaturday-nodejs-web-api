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
exports.InvalidCredentials = (data) => new CoreError(`Incorrect email or password`, 'E_INVALID_CREDENTIALS', 400, data);
exports.InvalidSession = (data) => new CoreError('You need to use a valid session token', 'E_INVALID_SESSION', 401, data);
exports.SessionExpired = (data) => new CoreError('Your session has expired', 'E_SESSION_EXPIRED', 401, data);
exports.NeedSession = (data) => new CoreError('Your need to be authenticated to use this resource', 'E_NEED_AUTHENTICATION', 403, data);
exports.EventNotFound = (data) => new CoreError('Wrong event Id', 'E_EVENT_NOT_FOUND', 400, data);
exports.FullEvent = (data) => new CoreError('Theres no coupons available for this event', 'E_RESOURCE_LOCKED', 423, data);
