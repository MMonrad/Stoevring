import { String } from "src/utils/stringExtensions";
import { Rest } from "src/utils/rest/rest";

export interface ISimpleProfile {
    id: string;
    customerUrl?: string;
}

export interface IProfile {
    id: string;
    legacyId: number;
    node?: INode;
    hashCode: number;

    address: string;
    city: string;
    displayName: string;
    email: string;
    firstName: string;
    fullName: string;
    lastName: string;
    name: string;
    phone: string;
    postalCode: string;
    title: string;
    wantsChinabookNotificationEmail: boolean;
    ssn: string;

    employeeId?: string;
    pipeSeparatedEmployeeGroupIds?: string;
    professionId?: string;


    [key: string]: string | number | boolean | LegacyId | INode;
}

export interface INode {
    type: NodeType;
    id: string;
    legacyId: LegacyId;

    parentId: string;

    customerId: string;
    departmentId: string;
    organizationId: string;
    apartmentId: string;

    isActive: boolean;
    isDeleted: boolean;
}

export interface LegacyId {
    type: "Citizen" | "Location";
    value: number;
}

export type NodeType = "Customer" | "Organization" | "Department" | "Apartment" | "Citizen";

export interface ICurrentProfileProvider {
    setCurrentProfile(profileId: string, customerUrl: string): Promise<Boolean>;
    getCurrentProfile(): ISimpleProfile | IProfile;
    clearCurrentProfile(): void;
}

export default class currentProfileProvider implements ICurrentProfileProvider {
    public static Instance: ICurrentProfileProvider = new currentProfileProvider();
    private _session = window.localStorage;

    clearCurrentProfile(): void {
        this._session.removeItem("current_profile");
    }

    public async setCurrentProfile(profileId: string, customerUrl: string): Promise<Boolean> {
        if (String.isNullOrWhiteSpace(profileId) || String.isNullOrWhiteSpace(customerUrl)) {
            throw new Error();
        }

        this._session.setItem("current_profile", JSON.stringify({
            id: profileId,
            customerUrl: customerUrl
        }));

        let body = {
            ids: [profileId]
        }

        var profiles = await Rest.Instance.execute<IProfile[]>({
            url: "/api/directory/profiles/batch-fetch",
            method: "POST",
            body: body,
        });
        
        let currentProfile = profiles[0];
        currentProfile.customerUrl = customerUrl;
        this._session.setItem("current_profile", JSON.stringify(currentProfile))

        return true;
    }

    public getCurrentProfile(): ISimpleProfile | IProfile {
        let profile: ISimpleProfile | IProfile | null = JSON.parse(this._session.getItem("current_profile"))

        if (!profile)
            throw new Error("Unable to find profile for current user");

        return profile;
    }
}