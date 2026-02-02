export interface BalanceDTO{
    userEmail: string;
    date: Date;
    time: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
}