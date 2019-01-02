import * as React from "react";
import { PureComponent } from "react";
import SelectorResults from "src/react/_hocs/fetchRequests/SelectorResults";
import { Rest, IRestRequest, IErrorRestResponse, ShowErrorUI } from "src/utils/rest/rest";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as AsyncLock from "async-lock";
import * as Enumerable from "linq";
import * as i18n from "i18next";
import { AppInsights } from "applicationinsights-js";

interface Props {}

interface State {
    ready: boolean;
}

export type RenderLoader = () => JSX.Element;

export interface Options {
    renderLoader?: RenderLoader;
    errorLabel?: string;
}

export interface SequentialRequest {
    propName: string;
    request: IRestRequest;
}

export interface ParallelRequest {
    SequentialRequests: SequentialRequest[];
}

export default function fetchRequests(requests: ((props: any)=> object) [] | ((props: any)=> object) | object, options?: Options) {
    return (WrappedComponent: PureComponent) => {

        return class fetchRequests extends PureComponent<Props, State> {
            private _lock = new AsyncLock();
            private _selectorMapping: any = {};
            private _dataMapping: any = {};

            constructor(props: Props) {
                super(props);
                this.state = { ready: false };
            }

            componentDidMount() {
                this._lock
                    .acquire("lock", async () => await this.sequentialRequests(requests))
                    .then(() => {
                        this.setState({ ready: true });
                    })
                    .catch(e => AppInsights.trackException(e));
            }

            private async sequentialRequests(requests: ((props: any) => object)[] | ((props: any) => object) | object): Promise<void> {
                let wrappedRequests: (object | ((props: any) => object))[];
                if (!Array.isArray(requests)) {
                    wrappedRequests = [requests];
                } else {
                    wrappedRequests = requests;
                }

                await this.asyncForEach(wrappedRequests, async (req: any) => {
                    if (typeof req === "function") {
                        req = req(Object.assign({}, this.props, this._dataMapping));
                    }

                    let firstError: IErrorRestResponse = null;
                    const promises = await Enumerable.from(Object.keys(req)).select(
                        async key => {
                            const request = req[key] as IRestRequest;
                            var response = await Rest.Instance.executeSelector({
                                ...request,
                                onError: (
                                    error: IErrorRestResponse,
                                    showErrorUI: ShowErrorUI
                                ) => {
                                    if (!firstError) {
                                        let label = i18n.t("global:errorMessages.unknown");
                                        if (options && options.errorLabel) {
                                            label = options.errorLabel;
                                        }
                                        firstError = error;
                                        showErrorUI(label, () =>
                                            this.sequentialRequests(requests)
                                        );
                                    }
                                    return true;
                                }
                            });
                            this._selectorMapping[key] = response.selector;
                            this._dataMapping[key] = response.json;
                        }
                    );

                    await Promise.all(promises.toArray());
                });
            }

            render(): JSX.Element {
                if (!this.state.ready) {
                    return (options && options.renderLoader && options.renderLoader()) || <CircularProgress thickness={2} size={40} />;
                }
                return <SelectorResults {...this.props} WrappedComponent={WrappedComponent} selectorMapping={this._selectorMapping} />;
            }

            private async asyncForEach(array: (object | ((props: any) => object))[], callback: (item: object | ((props: any) => object)) => Promise<void>): Promise<void> {
                for (let index = 0; index < array.length; index++) {
                    await callback(array[index]);
                }
            }
        };
    };
}
