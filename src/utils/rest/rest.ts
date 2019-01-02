import HttpStatusCode from "src/utils/rest/HttpStatusCode";
import { Store, AnyAction } from "redux";
import { authentication } from "src/utils/authentication/authentication";
import CurrentUserProvider, { IProfile } from "src/utils/currentUserProvider/CurrentUserProvider";
import { AppInsights } from "applicationinsights-js";
import { Guid } from "guid-typescript";
import { Selector } from "reselect";
import * as i18n from "i18next";
import * as errorActions from "src/redux/error/errorActions";
import * as cacheActions from "src/redux/cache/cacheActions";

export declare type HTTPMethod = "POST" | "GET" | "PUT" | "DELETE";

export interface IErrorRestResponse {
    statusCode: HttpStatusCode;
}

export type RetryHandler = () => void;
export type ShowErrorUI = (message: string, retryHandler?: RetryHandler) => boolean;
export type ErrorHandler = (error: IErrorRestResponse, showErrorUI: ShowErrorUI) => boolean;
export type CacheValidateHandler = (cache: object) => boolean;

export type SelectorResponse = {
    selector: Selector<any, any>;
    json: any;
};

export interface IRest {
    setStore(store: Store): void;
    execute(request: IRestRequest): Promise<void>;
    execute<T extends Object>(request: IRestRequest): Promise<T>;
    executeSelector(request: IRestRequest): Promise<SelectorResponse>;
}

export interface IRestRequest {
    url: string;
    method: HTTPMethod;
    headers?: [string, string][];
    body?: Object;
    onError?: ErrorHandler;
    cacheValidate?: CacheValidateHandler;
    cachePath?: string[];
}

export class Rest implements IRest {
    public static Instance: IRest = new Rest();

    private sessionId: Guid = Guid.create();
    private showErrorUI: ShowErrorUI;
    private store: Store;

    public setStore(store: Store): void {
        this.store = store;
        this.showErrorUI = (message: string, retryHandler?: RetryHandler) => {
            store.dispatch(errorActions.add(message, retryHandler));
            return true;
        };
    }
    public async executeSelector(request: IRestRequest): Promise<SelectorResponse> {
        const result = await this.execute(request);
        const selector = this.store.dispatch(cacheActions.generateSelector(
            request.cachePath
        ) as any);
        return {
            json: result as any,
            selector: selector as Selector<any, any>
        };
    }
    public async execute(request: IRestRequest): Promise<void>;
    public async execute<T extends Object>(request: IRestRequest): Promise<T> {
        const profile: IProfile = CurrentUserProvider.Instance.getCurrentProfile() as IProfile;

        const customerUrl = profile.customerUrl;

        // Check cacheValidate, if accepted return cached value without executing request.
        if (typeof request.cacheValidate === "function" && Array.isArray(request.cachePath)) {
            const cachedValue = this.store.dispatch(cacheActions.get(request.cachePath) as any);
            if (request.cacheValidate(cachedValue)) {
                return cachedValue as T;
            }
        }

        let options: RequestInit = {
            method: request.method,
            headers: {
                "Content-Type": "Application/json",
                Accept: "Application/json",
                Authorization: `Bearer ${await authentication.Instance.GetToken()}`,
                "sekoia.session_id": this.sessionId.toString(),
                "sekoia.correlation_id": Guid.create().toString()
            }
        };

        if (request.body) {
            options.body = JSON.stringify(request.body);
        }
        let response;
        try {
            response = await fetch(`${customerUrl}/${request.url}`, options);
        } catch (e) {
            this.showErrorUI(i18n.t("global:errorMessages.noInternet"), () => window.location.reload());
        }
        // 1. Check if request was ok and move on.
        if (response.status >= HttpStatusCode.OK && response.status <= 299) {
            const json = await response.json();

            // If we have a cachePath, save it to the cache.
            if (Array.isArray(request.cachePath)) {
                this.store.dispatch(cacheActions.save(request.cachePath, json));
            }
            return json as T;
        }

        this.executeErrorHandler(response, request.onError);
    }

    private async executeErrorHandler(
        response: Response,
        errorHandler?: ErrorHandler
    ): Promise<void> {
        AppInsights.trackException(
            new Error(
                `${
                    response.status
                } occred while sending request, response is ${await response.json}`
            )
        );

        if (response.status === 401) {
            return authentication.Instance.login();
        }

        const errorResponse: IErrorRestResponse = {
            statusCode: response.status
        };

        if (errorHandler) {
            let result = errorHandler(errorResponse, this.showErrorUI);

            if (result) {
                return;
            }
        }

        this.globalErrorHandler(response);
    }

    private async globalErrorHandler(response: Response): Promise<void> {
        AppInsights.trackException(
            new Error(
                `Uncaught ${
                    response.status
                } occred while sending request, response is ${await response.json}`
            )
        );

        this.showErrorUI("Something went wrong");
    }
}
