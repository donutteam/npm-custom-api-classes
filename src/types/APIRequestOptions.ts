//
// Type
//

export interface APIRequestOptions
{
	/** The method to use for the request. */
	method? : "HEAD" | "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
	
	/** The endpoint to request. */
	endpoint : string;

	/** The credentials mode to use for this request. */
	credentialsMode? : RequestCredentials;

	/** Any additional headers to add to the request. */
	headers? : HeadersInit;

	/** Additional parameters to append to the request URL. */
	parameters? : string | string[][] | Record<string, string> | URLSearchParams;

	/** Data for the request body. Only valid in in non-GET requests. */
	body? : object;
}