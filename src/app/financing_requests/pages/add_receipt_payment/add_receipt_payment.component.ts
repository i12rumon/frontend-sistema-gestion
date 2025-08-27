import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RequestService } from '../../service/request.service';
import { ActivatedRoute } from '@angular/router';
import { CancelButtonComponent } from "../../../shared/components/cancel-button/cancel-button.component";

@Component({
  selector: 'app-add-receipt-payment',
  imports: [CancelButtonComponent],
  templateUrl: './add_receipt_payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddReceiptPaymentComponent {
  requestService = inject(RequestService);
  activatedRoute = inject(ActivatedRoute);
  selectedFile = signal<File | null>(null);
  message = signal<string>('');
  errorMessage = signal<string>('');
  id = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!);
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  uploadFile(financingId: number) {
    const file = this.selectedFile();
    if (!file) {
      this.message.set('');
      this.errorMessage.set('El formato del archivo debe ser PDF. Por favor, selecciona el archivo correcto');
      return;
    }
    this.requestService.uploadPaymentReceipt(financingId, file).subscribe({
      next:
        (res) => {
          this.errorMessage.set('');
          this.message.set(res.message);
        },
      error: (err) => {
        this.message.set('');
        this.errorMessage.set(err.error?.Error || 'Error al subir el archivo');
      }
    });
  }
}
