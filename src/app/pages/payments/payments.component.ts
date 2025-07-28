import { HttpClient } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CashfreeserviceService } from 'src/app/services/cashfreeservice.service';
import { load } from '@cashfreepayments/cashfree-js';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {
cashfree: any;
  form: FormGroup;
  message = '';
  showPopup = false;
  paymentData: any = {};
  feedback = '';
  selectedCategory: string = '';
  selectedQuantity = 1;
  totalAmount = 24000;

  quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  fixedDonations = [
    { label: 'Milk (One Time)', amount: 2000 },
    { label: 'Fruits (One Time)', amount: 3000 },
    { label: 'Breakfast (One Time)', amount: 4000 },
    { label: 'Lunch With Sweet (One Time)', amount: 8000 },
    { label: 'Dinner With Sweet (One Time)', amount: 8000 },
    { label: 'Evening Snacks (One Time)', amount: 3500 }
  ];

  order = {
    order_id: 'ORDER_' + new Date().getTime(),
    order_amount: '',
    currency: 'INR',
    customer_details: {
      customer_name: '',
      customer_id: '',
      customer_email: '',
      customer_phone: '',
      customer_panNo: ''
    }
  };

  constructor(
    private payment: CashfreeserviceService,
    private _router: Router,
    // private toastr: ToastrService,
    // private spinner: NgxSpinnerService,
    private http: HttpClient,
    private fb: FormBuilder,
    private zone: NgZone
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      panNo: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.cashfree = await load();
  }

  setDonation(amount: number, category: string) {
    this.selectedCategory = category;
    this.order.order_amount = amount.toString();
  }

  updateTotal() {
    this.totalAmount = 24000 * this.selectedQuantity;
  }

  resetOrderForm() {
    this.order = {
      order_id: 'ORDER_' + new Date().getTime(),
      order_amount: '',
      currency: 'INR',
      customer_details: {
        customer_name: '',
        customer_id: '',
        customer_email: '',
        customer_phone: '',
        customer_panNo: ''
      }
    };
  }

  async initiatePayment() {
    const cashfree = await load();

    if (!this.order.customer_details.customer_id) {
      this.order.customer_details.customer_id = `CUST${Date.now()}`;
    }

    this.http.post('http://localhost:8000/token', this.order).subscribe({
      next: (res: any) => {
        const paymentSessionId = res.payment_session_id;

        const checkoutPromise = cashfree.checkout({
          paymentSessionId: paymentSessionId,
          redirectTarget: '_modal',
          mode: 'PROD' // Change to 'TEST' for testing
        });

        checkoutPromise.then((result: any) => {
          if (result.paymentDetails) {
            const { customer_name, customer_email, customer_panNo } = this.order.customer_details;

            // this.spinner.show(undefined, {
            //   type: 'ball-scale-multiple',
            //   size: 'medium',
            //   bdColor: 'rgba(0,0,0,0.6)',
            //   color: '#fff',
            //   fullScreen: true
            // });

            this.http.post('http://localhost:8000/generate-certificate', {
              name: customer_name,
              email: customer_email,
              panNo: customer_panNo
            }).subscribe({
              next: () => {
                // this.spinner.hide();
                this.message = 'Certificate sent to your email!';
                // this.toastr.success('Your certificate has been sent!', 'Success');
                this.launchConfetti();
              },
              error: () => {
                // this.spinner.hide();
                // this.toastr.error('Failed to send certificate.', 'Error');
              }
            });

            this.zone.run(() => {
              this.showPopupForm(result.paymentDetails);
              this.resetOrderForm();
            });
          }
        });
      },
      error: (err) => {
        console.error('Payment session error', err);
        // this.toastr.error('Payment session failed.', 'Error');
      }
    });
  }

  showPopupForm(data: any) {
    this.showPopup = true;
    this.paymentData = data;
    const name = this.order.customer_details.customer_name;
    const email = this.order.customer_details.customer_email;
    const panNo = this.order.customer_details.customer_panNo;
    this.form.patchValue({ name, email, panNo });
  }

  launchConfetti() {
    // Optional: Add animation here
  }

}
