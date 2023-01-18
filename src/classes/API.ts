//
// Imports
//

import { APIResponse } from "./APIResponse.js";

import type { APIMessage } from "../types/APIMessage.js";
import type { APIOptions } from "../types/APIOptions.js";
import type { APIFailureResponseCallback } from "../types/APIFailureResponseCallback.js";
import type { APIRequestOptions } from "../types/APIRequestOptions.js";

//
// Class
//

/** A class for easily communicating with JSON-oriented APIs. */
export class API
{
	/** The name of this API for logging purposes. */
	public readonly name : string;

	/** The base URL to the API, without the trailing /. */
	public readonly baseUrl : string;

	/** The default credentials mode for requests. */
	public readonly defaultCredentialsMode : RequestCredentials = "omit";

	/** A message included when a request outright fails for some reason. */
	public readonly failureMessage : APIMessage = 
		{
			code: "API_ERROR",
			message: "An error occured while contacting the API.",
		};

	/** An array of callbacks that will be executed on failed response. */
	public failureCallbacks : APIFailureResponseCallback[] = [];

	/**
	 * Constructs a new API.
	 *
	 * @author Loren Goodwin
	 */
	public constructor(options : APIOptions)
	{
		this.name = options.name;

		this.baseUrl = options.baseUrl;

		this.defaultCredentialsMode = options.defaultCredentialsMode ?? this.defaultCredentialsMode;

		this.failureMessage = options.failureMessage ?? this.failureMessage;
	}

	/**
	 * Adds a callback that will be called on a failure response.
	 *
	 * @author Loren Goodwin
	 */
	public addFailureResponseCallback(callback : APIFailureResponseCallback) : API
	{
		this.failureCallbacks.push(callback);

		return this;
	}

	/**
	 * Executes all of the failure callbacks, passing in the given array of messages.
	 *
	 * @author Loren Goodwin
	 */
	private executeFailureCallbacks(messages : APIMessage[])
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
	 * @author Loren Goodwin
	 */
	public async request(options : APIRequestOptions) : Promise<APIResponse>
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