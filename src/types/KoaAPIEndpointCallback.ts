//
// Imports
//

import type { Context } from "koa";

import type { APIResponse } from "./../classes/APIResponse.js";

//
// Type
//

export type KoaAPIEndpointCallback = (context : Context | object, response : APIResponse) => Promise<unknown>;