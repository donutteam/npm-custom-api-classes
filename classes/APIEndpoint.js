//
// Imports
//

import { APIResponse } from "./APIResponse.js";

//
// Exports
//

/**
 * @callback APIEndpointCallback
 * @param {import("koa").Context} context A Koa context.
 * @param {APIResponse} response 
 */

/**
 * A class for creating an API endpoint compatible with Koa.
 */
export class APIEndpoint
{
	/**
	 * The endpoint's callback.
	 * 
	 * @type {APIEndpointCallback}
	 */
	callback = null;

	/**
	 * The middleware function.
	 * 
	 * @type {import("koa").Middleware}
	 */
	execute;

	/**
	 * Constructs a new APIEndpoint.
	 * 
	 * @param {APIEndpointCallback} [callback] A callback for this endpoint. Optional, can be set later with setCallback.
	 * @author Loren Goodwin 
	 */
	constructor(callback)
	{
		this.callback = callback;

		this.execute = async (context, next) =>
		{
			context.response.status = 200;

			try
			{
				const response = new APIResponse();

				if (this.callback != null)
				{
					await this.callback(context, response);
				}
				else
				{
					response.addMessage({ code: "NOT_IMPLEMENTED", message: "This endpoint is not implemented yet." });
				}

				if (!response.success && context.response.status < 400)
				{
					context.response.status = 400;
				}
	
				response.addToKoaResponse(context);
			}
			catch(error)
			{
				console.error("[APIEndpoint] An error occured:", error);

				if (context.response.status < 400)
				{
					context.response.status = 500;
				}

				new APIResponse()
					.addMessage({ code: "UNKNOWN_ERROR", message: "An unknown error occured." })
					.addToKoaResponse(context);
			}
		};
	}

	/**
	 * Sets the callback for this endpoint.
	 * 
	 * @param {APIEndpointCallback} callback
	 */
	setCallback(callback)
	{
		this.callback = callback;
	}
}