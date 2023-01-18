//
// Imports
//

import type { Context } from "koa";
import type { APIMessage } from "../types/APIMessage.js";

//
// Class
//

/** A class that represents a response from an API. */
export class APIResponse
{
	/** Whether or not the response is a success. */
	public success = false;

	/** An array of messages related to the response. Typically used for errors. */
	public messages : APIMessage[] = [];

	/** An object containing data from a database. */
	public data : object = {};

	/** An object containing any extra data generated for this response. */
	public info : object = {};

	/**
	 * Constructs a new APIResponse.
	 * 
	 * @author Loren Goodwin
	 */
	constructor(apiResponse? : APIResponse)
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
	 * @author Loren Goodwin
	 */
	public setSuccess() : APIResponse
	{
		this.success = true;

		return this;
	}

	/**
	 * Adds a message to this response.
	 * 
	 * @author Loren Goodwin
	 */
	public addMessage(message : APIMessage) : APIResponse
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
	 * @author Loren Goodwin
	 */
	public mergeData(object : object) : APIResponse
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
	 * @author Loren Goodwin
	 */
	public mergeInfo(object : object) : APIResponse
	{
		this.info =
		{
			...this.info,
			...object,
		};

		return this;
	}

	/**
	 * Sets the response of the given Koa context to this response.
	 * 
	 * @author Loren Goodwin
	 */
	public addToKoaResponse(context : Context) : void
	{
		context.response.type = "application/json";
		context.response.body = JSON.stringify(this);
	}
}