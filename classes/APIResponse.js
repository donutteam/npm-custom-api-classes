//
// Imports
//

/**
 * @typedef {import("./API").APIMessage} APIMessage
 */

//
// Class
//

/**
 * A class that represents a response from an API.
 */
export class APIResponse
{
	/**
	 * Whether or not the response is a success.
	 * 
	 * @type {Boolean}
	 */
	success = false;

	/**
	 * An array of messages related to the response.
	 * 
	 * Usually used for errors.
	 * 
	 * @type {Array<APIMessage>}
	 */
	messages = [];

	/**
	 * An object containing data from a database.
	 * 
	 * @type {Object}
	 */
	data = {};

	/**
	 * An object containing any extra data generated for this response.
	 * 
	 * @type {Object}
	 */
	info = {};

	/**
	 * Constructs a new APIResponse.
	 * 
	 * @param {APIResponse} [apiResponse] Another APIResponse or an APIResponse-like object to initialise this one with. Optional.
	 * @author Loren Goodwin
	 */
	constructor(apiResponse)
	{
		if (apiResponse != undefined)
		{
			this.success = apiResponse.success ?? this.success;

			this.messages = apiResponse.messages ?? this.messages;

			this.data = apiResponse.data ?? this.data;

			this.info = apiResponse.info ?? this.info;
		}
	}

	/**
	 * Sets the response to being successful.
	 * 
	 * @returns {APIResponse}
	 * @author Loren Goodwin
	 */
	setSuccess()
	{
		this.success = true;

		return this;
	}

	/**
	 * Adds a message to this response.
	 * 
	 * @param {APIMessage} message An API message.
	 * @returns {APIResponse} The response for chaining.
	 * @author Loren Goodwin
	 */
	addMessage(message)
	{
		if (message.message == undefined)
		{
			message.message = message.code;
		}

		this.messages.push(message);

		return this;
	}

	/**
	 * Merges the given object into this response's data object, overwriting any keys with the same names.
	 * 
	 * @param {Object} object An object containing data objects.
	 * @returns {APIResponse} The response for chaining.
	 * @author Loren Goodwin
	 */
	mergeData(object)
	{
		this.data =
		{
			...this.data,
			...object,
		};

		return this;
	}

	/**
	 * Merges the given object into this response's info object, overwriting any keys with the same names.
	 * 
	 * @param {Object} object An object containing additional info generated for this response.
	 * @returns {APIResponse} The response for chaining.
	 * @author Loren Goodwin
	 */
	mergeInfo(object)
	{
		this.info =
		{
			...this.info,
			...object,
		};

		return this;
	}

	/**
	 * Adds this response object to the response in the given Koa context.
	 * 
	 * This should be called last.
	 * 
	 * @param {import("koa").Context} context
	 * @author Loren Goodwin
	 */
	addToKoaResponse(context)
	{
		context.response.type = "application/json";
		context.response.body = JSON.stringify(this);
	}
}