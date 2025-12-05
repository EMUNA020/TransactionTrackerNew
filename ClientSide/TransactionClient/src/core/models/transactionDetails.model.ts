import { category } from "./category.model";
import { Transactions } from "./transactions.model";

export interface TransactionDetails {

  transactions?: Transactions[];
  categoryList?: category[];
  transactionTotalAmount?: number;
  numOfTransactions?: number;
  averageTransactionAmount?: number;
}
