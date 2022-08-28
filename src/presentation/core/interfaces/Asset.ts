export interface Asset {
    id: number;
    main_name: string;
    type_name: string;
    brand_name: string;
    model: string;
    serial_number: string;
    sublocation_name: string;
    status_name: string;
}

export interface Services {
    id: number;
    name: string;
    checket: boolean;
}

enum AssetEnum {
    Account = 1,
    Customer = 2
  }