class CoreError extends Error {
	constructor(message, code, status, data) {
		super(message);
		this.code = code;
		this.data = data;
	}
}

// CoreError example
exports.InvalidParameter = (param, data) => new CoreError(`Invalid parameter '${param}'`, 'E_INVALID_PARAM', 400, data);
