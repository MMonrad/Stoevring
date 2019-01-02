import { UserManager, UserManagerSettings, User, WebStorageStateStore } from "oidc-client";
import IEnvironmentInformation from "src/utils/authentication/IEnvironmentInformation";
import EnvironmentDetection from "src/utils/authentication/EnvironmentDetection";
import currentProfileProvider from "src/utils/currentUserProvider/CurrentUserProvider";
import { CustomerMapping } from "src/utils/authentication/CustomerMapping";

export class authentication {
    private _environmentDetection: EnvironmentDetection = new EnvironmentDetection();
    private _manager: UserManager = new UserManager(this.getClientSettings());
    private _environmentInformation: IEnvironmentInformation;

    public static Instance = new authentication();

    public login(): void {
        this._manager.signinRedirect();
    }

    public async authenticate(): Promise<void> {
        const url = window.location.hash.replace("#/", "#");
        await this._manager.signinRedirectCallback(url);

        const profile = await this._manager.getUser();
        let profileTuple = CustomerMapping.Instance.getCustomerEndpoint(profile.access_token);
        let result = await currentProfileProvider.Instance.setCurrentProfile(
            profileTuple[1],
            profileTuple[0]
        );
        if (!result) {
            this.logout();
        } else {
            window.location.assign(this._manager.settings.redirect_uri);
        }
    }

    public async isAuthenticated(): Promise<boolean> {
        const user = await this._manager.getUser();

        return !(!user || !user.access_token) && !user.expired;
    }

    public async GetToken(): Promise<string> {
        const user = await this._manager.getUser();
        return user.access_token;
    }

    public logout(): void {
        this._manager.removeUser();
        this._manager.revokeAccessToken();
        const signoutUrl = this._manager.settings.metadata.end_session_endpoint;
        fetch(signoutUrl, {
            credentials: "include",
            mode: "no-cors"
        }).then(() => {
            currentProfileProvider.Instance.clearCurrentProfile();
            window.location.assign(this._manager.settings.redirect_uri);
        });
    }

    private getClientSettings(): UserManagerSettings {
        this._environmentInformation = this._environmentDetection.detectEnvironment();
        return {
            authority: this._environmentInformation.BaseAuthUrl + "issue/oauth2/",
            metadata: {
                authorization_endpoint:
                    this._environmentInformation.BaseAuthUrl + "issue/oauth2/authorize?",
                end_session_endpoint: this._environmentInformation.BaseAuthUrl + "account/signout?"
            },
            automaticSilentRenew: true,
            client_id: this._environmentInformation.ClientId,
            revokeAccessTokenOnSignout: true,
            post_logout_redirect_uri: `${window.location.protocol}//${window.location.host}/`,
            redirect_uri: `${window.location.protocol}//${window.location.host}/`,
            response_type: "token",
            scope: this._environmentInformation.Scope,
            silent_redirect_uri: `${window.location.protocol}//${window.location.host}/`,
            userStore: new WebStorageStateStore({ store: window.localStorage }),
            accessTokenExpiringNotificationTime: 300
        };
    }
}
