//
// Imports
//

import type { APIMessage } from "./APIMessage.js";

//
// Type
//

export interface APIOptions
{
	/** The name of this API, used for logging. */
	name : string;

	/** The base URL of this API. For example: https://example.com/api */
	baseUrl : string;

	/** The default credentials mode to use for requests. */
	defaultCredentialsMode? : RequestCredentials;

	/** A message included when a request outright fails for some reason. */
	failureMessage? : APIMessage;
}