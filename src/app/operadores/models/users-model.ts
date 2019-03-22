export interface UsersModel {
    id: number;
    name: string;
    username: string;
    email: string;
    address: AddressModel;
}

export interface AddressModel {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: GeoModel;
}

export interface GeoModel {
    lat: string;
    lng: string;
}