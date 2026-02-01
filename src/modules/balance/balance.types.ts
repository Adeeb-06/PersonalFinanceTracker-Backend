export interface BalanceDTO{
    userEmail: string;
    date: string;
    time: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
}