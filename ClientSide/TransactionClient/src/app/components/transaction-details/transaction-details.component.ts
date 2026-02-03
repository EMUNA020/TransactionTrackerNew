import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormField } from '@angular/material/form-field';
import { TransactionService } from '../../../core/services/transaction.service';
import { category } from '../../../core/models/category.model';
import { Transactions } from '../../../core/models/transactions.model';
import { TransactionDetails } from '../../../core/models/transactionDetails.model';


@Component({
    selector: 'app-transaction-details',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: './transaction-details.component.html',
})
export class TransactionDetailsComponent {
    constructor(
        public transactionService: TransactionService
    ) { }
    displayedColumns: string[] = ['date', 'category', 'description', 'amount', 'actions'];
    newTransaction: Transactions = {
        date: new Date(),
        description: '',
        amount: 0,
        category: { name: '' }
    };
    transactionDetails?: TransactionDetails;
    editingIndex: number | null = null;
    editedTransaction: Transactions | null = null;


    ngOnInit() {
        this.transactionService.loadTransactionDetails().subscribe(details => {
            this.transactionDetails = details;

        });
    }

    addTransaction() {
        if (this.newTransaction?.description && this.newTransaction.amount && this.newTransaction.category?.name) {
            const selectedCategory = this.transactionDetails?.categoryList?.find((cat: any) => cat.categoryName === this.newTransaction?.category?.name);
            this.newTransaction.categoryId = selectedCategory?.id;
            this.transactionDetails?.transactions?.push({
                ...this.newTransaction
            });
            this.transactionService.addNewTransaction(this.newTransaction).subscribe({
                next: () => {
                    this.newTransaction = {
                        date: new Date(),
                        description: '',
                        amount: 0,
                        category: { name: '' }
                    };
                    this.transactionDetails = this.transactionService.calculateAmounts(this.transactionDetails?.transactions, this.transactionDetails?.categoryList)
                },
                error: (err) => console.error(err)
            });
        }
    }

    deleteTransaction(index: number) {
        if (index == null || !this.transactionDetails?.transactions?.[index]) {
            console.warn('Transaction not found or missing id at index', index);
            return;
        }

        const transactionId = this.transactionDetails.transactions[index].id!;

        this.transactionService.deleteTransaction(transactionId).subscribe({
            next: () => {
                this.transactionDetails?.transactions?.splice(index, 1);

                this.transactionDetails = this.transactionService.calculateAmounts(
                    this.transactionDetails?.transactions,
                    this.transactionDetails?.categoryList
                );
            },
            error: (err) => {
                console.error('Failed to delete transaction:', err);
            }
        });
    }

    editTransaction(index: number) {
        if (!this.transactionDetails?.transactions?.[index]) return;
        this.editingIndex = index;
        this.editedTransaction = { ...this.transactionDetails.transactions[index] } as Transactions;
        // ensure the date is in YYYY-MM-DD format for the <input type="date"> control
        try {
            const raw = (this.transactionDetails.transactions[index].date as any);
            const d = raw ? new Date(raw) : new Date();
            (this.editedTransaction as any).date = d.toISOString().split('T')[0];
        } catch (err) {
            // fallback to today's date string
            (this.editedTransaction as any).date = new Date().toISOString().split('T')[0];
        }
    }

    cancelEdit() {
        this.editingIndex = null;
        this.editedTransaction = null;
    }

    saveEdit(index: number) {
        if (this.editingIndex === null || !this.editedTransaction) return;
        const tx = this.editedTransaction;
        const id = tx.id;
        if (!id) {
            console.error('Transaction id missing for update');
            return;
        }

        this.transactionService.updateTransaction(id, tx).subscribe({
            next: () => {
                // replace the transaction in the local list
                if (this.transactionDetails?.transactions) {
                    this.transactionDetails.transactions[index] = { ...tx };
                    this.transactionDetails = this.transactionService.calculateAmounts(this.transactionDetails.transactions, this.transactionDetails.categoryList);
                }
                this.cancelEdit();
            },
            error: (err) => console.error('Failed to update transaction:', err)
        });
    }

}
