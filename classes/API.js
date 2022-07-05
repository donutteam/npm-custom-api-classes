//
// Imports
//

import { APIResponse } from "./APIResponse.js";

//
// Type Definitions
//

/**
 * @typedef {Object} APIMessage
 * @property {Number|String} code A string or number code associated with the message.
 * @property {String} [message] A message that explains the error code.
 * @author Loren Goodwin
 */

/**
 * @callback FailureResponseCallback
 * @param {Array<APIMessage>} messages An array of messages related to the failure response.
 * @author Loren Goodwin
 */

//
// Class
//

/**
 * A class for easily communicating with JSON-oriented APIs.
 */
export class API
{
	/**
	 * The name of this API for logging purposes.
	 * 
	 * @type {String}
	 */
	name = "API";

	/**
	 * The base URL to the API, without the trailing /.
	 *
	 * @type {String}
	 */
	baseUrl = "";

	/**
	 * The default credentials mode for requests.
	 *
	 * @type {String}
	 */
	defaultCredentialsMode = "omit";

	/**
	 * A message included when a request outright fails for some reason.
	 *
	 * @type {APIMessage}
	 */
	failureMessage = 
		{
			code: "API_ERROR",
			message: "An error occured while contacting the API.",
		};

	/**
	 * An array of callbacks that will be executed on failed response.
	 *
	 * @type {Array<Function>}
	 */
	failureCallbacks = [];

	/**
	 * Constructs a new API.
	 *
	 * @param {Object} [options] Options for the API.
	 * @param {String} [options.name] The name of this API for logging purposes. Optional, defaults to "API".
	 * @param {String} [options.baseUrl] The base URL for the API.
	 * @param {"omit"|"include"} [options.defaultCredentialsMode] The default credentials mode for this API. Optional, defaults to "omit".
	 * @param {APIMessage} [options.failureMessage] The message returned when an API request fails for some reason.
	 * @author Loren Goodwin
	 */
	constructor(options)
	{
		this.name = options.name ?? this.name;

		this.baseUrl = options.baseUrl ?? this.baseUrl;

		this.defaultCredentialsMode = options.defaultCredentialsMode ?? this.defaultCredentialsMode;

		this.failureMessage = options.failureMessage ?? this.failureMessage;
	}

	/**
	 * Adds a callback that will be called on a failure response.
	 *
	 * @param {FailureResponseCallback} callback A callback that will be passed the array of response messages.
	 * @author Loren Goodwin
	 */
	addFailureResponseCallback(callback)
	{
		this.failureCallbacks.push(callback);
	}

	/**
	 * Executes all of the failure callbacks.
	 *
	 * @param {Array<APIMessage>} messages An array of APIMessage objects that indicate why a request failed or was rejected.
	 * @author Loren Goodwin
	 */
	executeFailureCallbacks(messages)
	{
		for (const callback of this.failureCallbacks)
		{
			try
			{
				callback(messages);
			}
			catch (error)
			{
				console.error(`[${ this.name }] Error executing failure callback:`, error);
			}
		}
	}

	/**
	 * Performs a request to the API.
	 *
	 * @param {Object} options Options for the request.
	 * @param {"HEAD"|"GET"|"PUT"|"POST"|"PATCH"|"DELETE"} [options.method] The method for the request. Optional, defaults to GET.
	 * @param {String} options.endpoint The API endpoint to use.
	 * @param {"omit"|"include"} [options.credentialsMode] The credentials mode to use. Optional, defaults to the API object's defaultCredentialsMode.
	 * @param {HeadersInit} [options.headers] Any additional headers to add to the request.
	 * @param {String|String[][]|Record<string, string>|URLSearchParams} [options.parameters] Additional parameters to append to the request URL.
	 * @param {Object} [options.body] Data for the request body. Only valid in in non-GET requests.
	 * @returns {APIResponse} An API response object.
	 * @author Loren Goodwin
	 */
	async request(options)
	{
		try
		{
			//
			// Build Request URL
			//

			let requestUrl = this.baseUrl + options.endpoint;

			const searchParameters = new URLSearchParams(options.parameters ?? {}).toString();

			if (searchParameters != "")
			{
				requestUrl += "?" + searchParameters;
			}

			//
			// Request Init Parameters
			//

			const method = options.method ?? "GET";

			const credentials = options.credentialsMode ?? this.defaultCredentialsMode;

			const headers = new Headers(options.headers ?? {});

			const contentType = options.body instanceof FormData ? "multipart/form-data" : "application/json";

			if (method != "GET" && contentType == "application/json")
			{
				headers.append("Content-Type", "application/json");
			}

			let body = null;

			if (method == "POST" || method == "PUT" || method == "PATCH")
			{
				body = contentType == "multipart/form-data" ? options.body : JSON.stringify(options.body ?? {});
			}

			//
			// Execute Request
			//

			const rawResponse = await fetch(requestUrl,
				{
					method,
					credentials,
					headers,
					body,
				});

			//
			// Parse the response as JSON
			//

			const response = new APIResponse(await rawResponse.json());

			//
			// Execute Failure Callbacks
			//

			if (response.success == false)
			{
				this.executeFailureCallbacks(response.messages);
			}

			//
			// Return APIResponse object
			//

			return response;
		}
		catch (error)
		{
			const response = new APIResponse().addMessage(this.failureMessage);

			this.executeFailureCallbacks(response.messages);

			console.error(`[${ this.name }] An error occured:`, error);

			return response;
		}
	}
}