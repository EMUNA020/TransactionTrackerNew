import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { TransactionDetailsComponent } from './app/components/transaction-details/transaction-details.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(TransactionDetailsComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideHttpClient()  
  ]
})
  .catch(err => console.error(err));
