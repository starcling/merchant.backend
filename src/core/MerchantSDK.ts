import pumapay_merchant_sdk from 'pumapay_merchant_sdk';

/**
 * @description Singleton class that holds the instance of the merchant SDK
 */
export class MerchantSDK {

    private static sdk: pumapay_merchant_sdk = null;

    private constructor() {}

    /**
     * @description Returns the sdk object instantiated with given params
     * @param {any} [params] Required only the first time. Parameters for merchant SDK for now its apiURL {string}, apiKey {string}
     */
    public static GET_SDK() {
        if (this.sdk) {
            return this.sdk;
        }
        this.sdk = new pumapay_merchant_sdk();

        return this.sdk;
    }
}