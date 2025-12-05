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

}
