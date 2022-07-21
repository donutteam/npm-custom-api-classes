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
 * @returns {Promise<void>}
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
	 * @author Loren Goodwin 
	 */
	constructor()
	{
		this.execute = async (context, next) =>
		{
			try
			{
				const response = new APIResponse();

				if (this.callback != null)
				{
					await this.callback(context, response);
				}
	
				response.addToKoaResponse(context);
			}
			catch(error)
			{
				new APIResponse()
					.addMessage({ code: "UNKNOWN_ERROR", message: "An unknown error occured." })
					.addToKoaResponse(context);
			}
		};
	}
}