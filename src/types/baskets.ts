export type ParameterType = {
  value: unknown;
  name: string;
  type: string;
  options: {
    key: string;
    value: number;
  }[]
};

export interface ItemMain {
  value: number;
  color?: string;
}

export type BasketInfoModel = Record<string, ItemMain>;


export type ParameterFileType = {
  params: ParameterType[];
  id: string;
  headerValue: string;
  updating: boolean;
}
export interface BasketModel {
  basketId: string;
  serverId: string;
  name: string;
  info: {
    main: BasketInfoModel;
    extra?: BasketInfoModel[];
  };
  parameters: ParameterFileType[];
  success: boolean;
  accessType?: AccessType;
  address: string;
}

export type UserAccessType = {
  userId: string;
  username: string;
  accessType: AccessType;
}

export enum AccessType {
  User = 1,
  Investor = 2
}

export type BasketUsers = {
  basketId: string;
  basketName: string;
  users: UserAccessType[];
};

export type BasketUserResponse = BasketUsers[];

export interface UserBasketPermission {
  id: string;
  basketId: string;
  accessType: AccessType;
  address: string;
  basketName: string;
}

export enum TimeFilterType {
  Last24Hours = 1,
  Last7Days = 2,
  Last30Days = 3,
  SpecificDate = 4
}