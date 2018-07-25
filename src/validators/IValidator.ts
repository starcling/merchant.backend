
export abstract class IValidator {
    public abstract validate(object: any, options?: any);
    // tslint:disable-next-line:unified-signatures
    public abstract validate(object: any, schema: any, options?: any);
}