import { Thunk, Action, Actions, State, StateMapper, Computed } from 'easy-peasy'

/**
 * USER DATA
 */

 export interface UserType {
    address?: string;
    label?: string;
    network: 'polygon';
}

export interface BalanceType {
    amount: number;
    apy: number;
}

export interface EarningsType {
    farmingBalance: BalanceType;
    yearly: BalanceType;
    weekly: BalanceType;
    daily: BalanceType;
}

/**
 * ACTIONS
 */

export interface ConnectUserType {
    address: string;
}

/**
 * STORE
 */

export type StoreActions = Actions<Omit<StoreType, 'data'>>;
export type StoreState = State<StoreType>;

export type StoreStateParam = (param: StoreState) => any
export type StoreActionsParams = (param: StoreActions) => any

export interface StoreDataType {
    user: UserType;
    earnings: EarningsType;
}

export interface StoreActionType {
    connectUser: Action<StoreType, ConnectUserType>;
    login: Thunk<StoreActionType, void, any, StoreType>;
    getPoolsData: Thunk<StoreActionType, string, any, StoreType>;
}


export interface StoreType extends StoreActionType {
    data: StoreDataType
}