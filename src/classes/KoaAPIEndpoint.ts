//
// Imports
//

import type { Middleware } from "koa";

import { APIResponse } from "./APIResponse.js";

import type { KoaAPIEndpointCallback } from "../types/KoaAPIEndpointCallback.js";

//
// Exports
//

/** A class for creating an API endpoint compatible with Koa. */
export class KoaAPIEndpoint
{
	/** This endpoint's callback. */
	public callback : KoaAPIEndpointCallback;

	/** The middleware function. */
	public execute : Middleware;

	/**
	 * Constructs a new APIEndpoint.
	 * 
	 * @author Loren Goodwin 
	 */
	public constructor(callback? : KoaAPIEndpointCallback)
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

	/** Sets the callback for this endpoint. */
	public setCallback(callback : KoaAPIEndpointCallback)
	{
		this.callback = callback;
	}
}