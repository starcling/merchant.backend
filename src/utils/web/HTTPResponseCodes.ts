
export class HTTPResponseCodes {
    /**
     * @description Response to a successful GET, PUT, PATCH or DELETE.Can also be used for a POST that doesn't result in a creation.
     */
    public static OK(): number {
        return 200;
    }

    /**
     * @description Response to a POST that results in a creation.
     * Should be combined with a Location header pointing to the location of the new resource
     */
    public static CREATED(): number {
        return 201;
    }

    /**
     * @description Response to a successful request that won't be returning a body (like a DELETE request)
     */
    public static NO_CONTENT(): number {
        return 204;
    }

    /**
     * @description Used when HTTP caching headers are in play
     */
    public static NOT_MODIFIED(): number {
        return 304;
    }

    /**
     * @description The request is malformed, such as if the body does not parse. Incorrect parameters.
     */
    public static BAD_REQUEST(): number {
        return 400;
    }

    /**
     * @description When no or invalid authentication details are provided.
     * Also useful to trigger an auth popup if the API is used from a browser
     */
    public static UNAUTHORIZED(): number {
        return 401;
    }

    /**
     * @description When authentication succeeded but authenticated user doesn't have access to the resource
     */
    public static FORBIDDEN(): number {
        return 403;
    }

    /**
     * @description When a non - existent resource is requested
     */
    public static NOT_FOUND(): number {
        return 404;
    }

    /**
     * @description When an HTTP method is being requested that isn't allowed for the authenticated user
     */
    public static METHOD_NOT_ALLOWED(): number {
        return 405;
    }

    /**
     * @description Indicates that the resource at this end point is no longer available.Useful as a blanket response for old API versions
     */
    public static GONE(): number {
        return 410;
    }

    /**
     * @description If incorrect content type was provided as part of the request
     */
    public static UNSUPPORTED_MEDIA_TYPE(): number {
        return 415;
    }

    /**
     * @description Used for validation errors
     */
    public static UNPROCESSABLE_ENTITY(): number {
        return 422;
    }

    /**
      * @description Used to lock any request
     */
    public static LOCKED(): number {
        return 423;
    }

    /**
     * @description When a request is rejected due to rate limiting
     */
    public static TOO_MANY_REQUESTS(): number {
        return 429;
    }

    /**
     * @description When an unexpected internal error occured. Usualy a malformed code that was overlooked.
     */
    public static INTERNAL_SERVER_ERROR(): number {
        return 500;
    }
}