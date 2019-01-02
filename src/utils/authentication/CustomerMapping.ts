import JWTTokenDecoder from "src/utils/authentication/jwtTokenDecoder";
import {Environment} from "src/utils/environmentVariables";

export interface ICustomerMapping {
    getCustomerEndpoint(accessToken: string): [string, string];
}

export class CustomerMapping implements ICustomerMapping {
    public static Instance: ICustomerMapping = new CustomerMapping();

    private _tokenDecoder: JWTTokenDecoder;
    private _devMapping: Map<string, string>;
    private _preprodMapping: Map<string, string>;
    private _productionMapping: Map<string, string>;

    private constructor() {
        this._devMapping = new Map<string, string>();
        this._preprodMapping = new Map<string, string>();
        this._productionMapping = new Map<string, string>();
        this._tokenDecoder = new JWTTokenDecoder();
        this.mapCustomers();
    }

    public getCustomerEndpoint(accessToken: string):  [string, string] {
        const decodedToken: any = this._tokenDecoder.decodeToken(accessToken);
        console.log(decodedToken);
        const customerId: string = decodedToken['sekoia:CustomerId'];
        const profileId: string = decodedToken['nameid'];
        console.log(profileId);
        const environment: string = process.env.SEKOIA_ENV;

        switch (environment) {
            case Environment.local.toString():
            case Environment.dev.toString():
                return [(this._devMapping.get(customerId) || 'https://storetrae-dev-dk.sekoia.one'), profileId];
            case Environment.preprod.toString():
                return [this._preprodMapping.get(customerId), profileId];
            case Environment.prod.toString():
                return [this._productionMapping.get(customerId), profileId];
            default:
                throw ('Unknown environment.')
        }

    }

    private mapCustomers(): void {
        this._devMapping.set('C5101B08-A32E-4426-A456-EEF127F9C7FD', 'https://storetrae-dev-dk.sekoia.one');
        this._devMapping.set('C485BB1E-2557-48B1-9ED6-6FC892E86B41', 'https://storetrae-dev-dk.sekoia.one');
        this._preprodMapping.set('7B3D3198-5B7F-43FD-BC6F-EE01F340FFC8', 'https://storetrae-preprod-dk.sekoia.one');
    }
}