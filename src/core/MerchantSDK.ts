import puma_sdk_core from 'puma_sdk_core';

/**
 * @description Singleton class that holds the instance of the merchant SDK
 */
export class MerchantSDK {

    private static sdk: puma_sdk_core = null;

    private constructor() {}

    /**
     * @description Returns the sdk object instantiated with given params
     * @param {any} [params] Required only the first time. Parameters for merchant SDK for now its apiURL {string}, apiKey {string}
     */
    public static GET_SDK() {
        if (this.sdk) {
            return this.sdk;
        }
        this.sdk = new puma_sdk_core();

        return this.sdk;
    }
}