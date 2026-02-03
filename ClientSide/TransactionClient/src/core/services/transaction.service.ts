import { Observable, forkJoin, map } from "rxjs";
import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Transactions } from "../models/transactions.model";
import { TransactionDetails } from "../models/transactionDetails.model";
import { category } from "../models/category.model";
@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    constructor(private apiService: ApiService) {
    }

    loadTransactionDetails(): Observable<TransactionDetails> {
        const transactions$ = this.apiService.getInfo<Transactions[]>('Transactions/GetTransactionDetails');
        const categories$ = this.apiService.getInfo<category[]>('Transactions/GetCategoryList');

        return forkJoin({
            transactions: transactions$,
            categoryList: categories$
        }).pipe(
            map(response => this.calculateAmounts(response.transactions, response.categoryList))
        );
    }

    calculateAmounts(
        transactions: Transactions[] = [],
        categories: category[] = []
    ): TransactionDetails {
        const totalAmount = Array.isArray(transactions)
            ? transactions.reduce((sum, t) => sum + (t.amount ?? 0), 0)
            : 0;

        const numOfTransactions = transactions?.length ?? 0;
        const averageTransactionAmount = numOfTransactions > 0 ? totalAmount / numOfTransactions : 0;

        categories?.forEach(cat => {
            cat.totalAmount = Array.isArray(transactions)
                ? transactions
                    .filter(t => t.categoryId === cat.id)
                    .reduce((sum, t) => sum + (t.amount ?? 0), 0)
                : 0;
        });

        return {
            transactions,
            categoryList: categories,
            transactionTotalAmount: totalAmount,
            numOfTransactions,
            averageTransactionAmount,
        } as TransactionDetails;
    }


    addNewTransaction(newTransaction: Transactions): Observable<any> {
        return this.apiService.post<Transactions[]>(`Transactions/AddTransactionLine`, newTransaction);
    }

    deleteTransaction(id: number): Observable<any> {
        return this.apiService.delete<any>(`Transactions/DeleteTransactionLine/${id}`, id);
    }

    updateTransaction(id: number, updatedTransaction: Transactions): Observable<any> {
        return this.apiService.put<any>(`Transactions/UpdateTransactionLine/${id}`, updatedTransaction);
    }
}
