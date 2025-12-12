import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CashfreeserviceService } from 'src/app/services/cashfreeservice.service';

declare const Cashfree: any;

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})

export class PayComponent implements OnInit {

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

  // async initiatePayment() {
  //   try {
  //     // Make sure order_amount is filled
  //     if (!this.order.order_amount || Number(this.order.order_amount) <= 0) {
  //       this.toastr.error('Please enter or select a valid donation amount');
  //       return;
  //     }

  //     // Convert to string (Cashfree expects string in order_amount)
  //     this.order.order_amount = Number(this.order.order_amount).toString();

  //     const CashfreeGlobal = await this.waitForCashfree(1000);
  //     const cashfree = CashfreeGlobal({ mode: 'sandbox' });

  //     if (!this.order.customer_details.customer_id) {
  //       this.order.customer_details.customer_id = `CUST${Date.now()}`;
  //     }

  //     // Send request to backend
  //     const res: any = await this.http.post('http://localhost:8000/token', this.order).toPromise();

  //     if (!res?.payment_session_id) {
  //       this.toastr.error('Invalid session ID returned from server.');
  //       return;
  //     }

  //     const result = await cashfree.checkout({
  //       paymentSessionId: res.payment_session_id,
  //       redirectTarget: '_modal'
  //     });

  //     if (result.paymentDetails?.payment_status === 'SUCCESS') {
  //       this.zone.run(() => {
  //         this.showPopupForm(result.paymentDetails);
  //       });
  //     } else {
  //       this.toastr.warning('Payment was not completed.');
  //     }
  //   } catch (err) {
  //     console.error('Payment error:', err);
  //     this.toastr.error('Something went wrong while processing payment.');
  //   }
  // }

async initiatePayment() {
  try {
    if (!this.order.order_amount || Number(this.order.order_amount) <= 0) {
      this.toastr.error('Please enter or select a valid donation amount');
      return;
    }

    this.order.order_amount = Number(this.order.order_amount).toString();

    const CashfreeGlobal = await this.waitForCashfree(1000);
    const cashfree = CashfreeGlobal({ mode: 'sandbox' }); // change to 'production' in live

    if (!this.order.customer_details.customer_id) {
      this.order.customer_details.customer_id = `CUST${Date.now()}`;
    }

    const res: any = await this.http.post('http://localhost:8000/token', this.order).toPromise();
    if (!res?.payment_session_id) {
      this.toastr.error('Invalid session ID returned from server.');
      return;
    }

    const result = await cashfree.checkout({
      paymentSessionId: res.payment_session_id,
      redirectTarget: '_modal'
    });

    // ✅ Show popup immediately after success
    if (result.paymentDetails?.payment_status === 'SUCCESS') {
      console.log('✅ Payment success:', result.paymentDetails);

      this.zone.run(() => {
        this.showPopupForm(result.paymentDetails); // popup opens automatically
      });
    } else {
      this.toastr.warning('Payment was not completed.');
    }
  } catch (err) {
    console.error('Payment init error', err);
    this.toastr.error('Something went wrong during payment.');
  }
}

showPopupForm(data: any) {
  this.showPopup = true;
  this.paymentData = data;

  const { customer_name, customer_email, customer_panNo } = this.order.customer_details;

  // Pre-fill certificate form with donor details
  this.form.patchValue({
    name: customer_name,
    email: customer_email,
    panNo: customer_panNo
  });
}

async submitCertificateForm() {
  if (this.form.invalid) {
    this.toastr.warning('Please fill all required fields.');
    return;
  }

  const { name, email, panNo } = this.form.value;

  try {
    await this.http.post('http://localhost:8000/generate-certificate', {
      name,
      email,
      panNo
    }).toPromise();

    this.message = '🎉 Payment successful! Certificate will be sent to your email shortly.';
    this.launchConfetti();

    // ✅ Close popup & reset forms
    this.showPopup = false;
    this.resetOrderForm();
    this.form.reset();
  } catch (err) {
    console.error('❌ Certificate generation failed:', err);
    this.message = 'Payment successful, but certificate could not be sent.';
  }
}

  // submitCertificateForm() {
  //   if (this.form.invalid) {
  //     this.toastr.warning('Please fill in required fields.');
  //     return;
  //   }

  //   const { name, email, panNo } = this.form.value;

  //   this.http.post('http://localhost:8000/generate-certificate', {
  //     name,
  //     email,
  //     panNo
  //   }).subscribe({
  //     next: () => {
  //       this.message = 'Certificate sent successfully to ' + email;
  //       this.toastr.success(this.message);
  //       this.showPopup = false;
  //       this.resetOrderForm();
  //       this.form.reset();
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.toastr.error('Certificate generation failed');
  //     }
  //   });
  // }



  // async initiatePayment() {
  //   try {
  //     // 1) ensure SDK is available
  //     const CashfreeGlobal = await this.waitForCashfree(1000); // wait up to 8s

  //     // 2) create an instance - IMPORTANT: mode should be 'production' or 'sandbox' (lowercase)
  //     // const cashfree = CashfreeGlobal({ mode: 'production' }); // change to 'sandbox' for testing
  //     const cashfree = CashfreeGlobal({ mode: 'sandbox' }); // change to 'sandbox' for testing

  //     // 3) ensure customer_id
  //     if (!this.order.customer_details.customer_id) {
  //       this.order.customer_details.customer_id = `CUST${Date.now()}`;
  //     }

  //     // 4) create order via your backend
  //     // const res: any = await this.http.post('https://bvjss.org/Backend/token', this.order).toPromise();
  //     const res: any = await this.http.post('http://localhost:8000/token', this.order).toPromise();

  //     if (!res || !res.payment_session_id) {
  //       console.error('Invalid session response:', res);
  //       this.toastr.error('Invalid session ID returned from server.');
  //       return;
  //     }

  //     // 5) open checkout (use redirectTarget _modal or _self/_blank)
  //     const result = await cashfree.checkout({
  //       paymentSessionId: res.payment_session_id,
  //       redirectTarget: '_modal'
  //       // you can add other optional fields
  //     });

  //     // 6) handle result
  //     if (result.paymentDetails && result.paymentDetails.payment_status === 'SUCCESS') {
  //       console.log('Payment success:', result.paymentDetails);

  //       // Send certificate request to backend
  //       const { customer_name, customer_email, customer_panNo } = this.order.customer_details;

  //       try {
  //         await this.http.post('http://localhost:8000/generate-certificate',
  //           // await this.http.post('https://bvjss.org/Backend/generate-certificate',
  //           {
  //             name: customer_name,
  //             email: customer_email,
  //             panNo: customer_panNo
  //           }).toPromise();

  //         this.message = 'Payment successful! Certificate will be sent to your email shortly.';
  //         this.launchConfetti();
  //       } catch (certErr) {
  //         console.error('Certificate generation failed', certErr);
  //         this.message = 'Payment successful, but certificate could not be sent.';
  //       }

  //       // Show success popup
  //       this.zone.run(() => {
  //         this.showPopupForm(result.paymentDetails);
  //         this.resetOrderForm();
  //       });
  //     } else {
  //       console.warn('Payment not successful or canceled.');
  //     }
  //   } catch (err: any) {
  //     console.error('Payment init error', err);
  //     this.toastr.error(typeof err === 'string' ? err : 'Payment initiation failed');
  //   }
  // }

  // showPopupForm(data: any) {
  //   this.showPopup = true;
  //   this.paymentData = data;
  //   const name = this.order.customer_details.customer_name;
  //   const email = this.order.customer_details.customer_email;
  //   const panNo = this.order.customer_details.customer_panNo;
  //   this.form.patchValue({ name, email, panNo });
  // }

  // async submitCertificateForm() {
  //   if (this.form.invalid) {
  //     this.toastr.warning('Please fill all required fields.');
  //     return;
  //   }

  //   const { name, email, panNo } = this.form.value;

  //   try {
  //     await this.http.post('http://localhost:8000/generate-certificate', {
  //       name,
  //       email,
  //       panNo
  //     }).toPromise();

  //     this.message = '🎉 Payment successful! Certificate will be sent to your email shortly.';
  //     this.launchConfetti();
  //     this.showPopup = false;
  //     this.resetOrderForm();
  //   } catch (err) {
  //     console.error('Certificate generation failed', err);
  //     this.message = 'Payment successful, but certificate could not be sent.';
  //   }
  // }

  ngOnInit(): void {

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