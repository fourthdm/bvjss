import { HttpClient } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CashfreeserviceService } from 'src/app/services/cashfreeservice.service';
import { load } from '@cashfreepayments/cashfree-js';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import confetti from 'canvas-confetti';

declare const Cashfree: any;

declare global {
  interface Window { Cashfree: any; }
}


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
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
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

  }

// async initiatePayment() {
//   if (!window.Cashfree) {
//     console.error('Cashfree SDK not loaded yet!');
//     return;
//   }
//   await window.Cashfree.checkout({
//     paymentSessionId: 'abc123',
//     redirectTarget: '_modal',
//     mode: 'PROD'
//   });
// }

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

  // async initiatePayment() {
  //   // Create dummy customer ID if missing
  //   if (!this.order.customer_details.customer_id) {
  //     this.order.customer_details.customer_id = `CUST${Date.now()}`;
  //   }

  //   // Call backend to generate payment session ID
  //   this.http.post('https://ysurveillance.com/BvjssBackend/token', this.order).subscribe({
  //     next: (res: any) => {
  //       const paymentSessionId = res.payment_session_id;

  //       if (!paymentSessionId) {
  //         console.error('No paymentSessionId returned!');
  //         this.toastr.error('Payment session creation failed.');
  //         return;
  //       }

  //       // ✅ Use Cashfree.checkout, NOT new Cashfree()
  //       Cashfree.checkout({
  //         paymentSessionId: paymentSessionId,
  //         redirectTarget: '_modal',
  //         mode: 'PROD'  // or 'TEST' if you're testing
  //       });
  //     },
  //     error: (err) => {
  //       console.error('Payment session error', err);
  //       this.toastr.error('Payment session failed.', 'Error');
  //     }
  //   });
  // }


  async waitForCashfree(timeout = 1000): Promise<any> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        // @ts-ignore
        if ((window as any).Cashfree && typeof (window as any).Cashfree === 'function') {
          resolve((window as any).Cashfree);
        } else if (Date.now() - start > timeout) {
          reject('Cashfree SDK not loaded');
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }


  async initiatePayment() {
    // const cashfree = await load();
    if (typeof Cashfree === 'undefined' || typeof Cashfree.checkout !== 'function') {
      console.error('Cashfree SDK not loaded.');
      return;
    }
    if (!this.order.customer_details.customer_id) {
      this.order.customer_details.customer_id = `CUST${Date.now()}`;
    }

    this.http.post('https://ysurveillance.com/BvjssBackend/token', this.order).subscribe({
      next: (res: any) => {

        const paymentSessionId = res.payment_session_id;

        if (!paymentSessionId) {
          this.toastr.error('Invalid session ID returned from server.');
          console.error(' Invalid or missing payment_session_id:', res);
          return;
        }

        const checkoutPromise = Cashfree.checkout({
          paymentSessionId: paymentSessionId,
          redirectTarget: '_modal',
          mode: 'production'
        });

        checkoutPromise.then((result: any) => {
          if (result.paymentDetails) {
            const { customer_name, customer_email, customer_panNo } = this.order.customer_details;

            if (!customer_panNo && customer_panNo.trim() === '') {
              alert('You are not entered a Pan number certificate not generated.')
              this.http.post('https://ysurveillance.com/BvjssBackend/generate-certificate', {
                name: customer_name,
                email: customer_email,
                panNo: customer_panNo
              }).subscribe({
                next: () => {
                  this.message = 'Certificate sent to your email!';
                  this.launchConfetti();
                },
                error: () => {
                  console.error('Certificate generation failed');
                }
              });
            } else {
              this.message = 'Payment successful. Certificate not sent as PAN number was not provided.';
            }

            this.zone.run(() => {
              this.showPopupForm(result.paymentDetails);
              this.resetOrderForm();
            });
          }
        });
      },
      error: (err) => {
        console.error('Payment session error', err);
        this.toastr.error('Payment session failed.', 'Error');
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

  launchConfetti(): void {

    const frame = () => {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        // colors: ['#732255', '#FFCA6C', '#FDFFB8', '#414042'],
        // shapes: ['circle', 'square', 'triangle', 'reactangle'],
        scalar: 1.5,
      })
    }

    frame();
  }
}
