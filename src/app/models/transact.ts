export interface Transaction {
    name: string;
    contact: string;
    gender: string;
    dob: string;
    orderDate: string;
    orderType: string;
    unit: number;
    btcAddress: string;
    rate?: number;
    total?: number;
    id?: string;
}

export interface TransactResponse {
    success: string;
    message: string;
    transactionId: string;
    transaction: Transaction;
}
