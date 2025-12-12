import { HttpClient } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CashfreeserviceService } from 'src/app/services/cashfreeservice.service';

@Component({
  selector: 'app-don',
  templateUrl: './don.component.html',
  styleUrls: ['./don.component.css']
})
export class DonComponent {
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

  ngOnInit() { }

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
    try {
      const CashfreeGlobal = await this.waitForCashfree(1000);
      const cashfree = CashfreeGlobal({ mode: 'sandbox' }); // use 'production' in live

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

      // ✅ Only handle payment success here
      if (result.paymentDetails?.payment_status === 'SUCCESS') {
        console.log('Payment success:', result.paymentDetails);

        this.resetOrderForm();
        // open popup form with pre-filled details
        this.zone.run(() => {
          this.showPopupForm(result.paymentDetails);
        });
      } else {
        this.toastr.warning('Payment was not completed.');
      }
    } catch (err: any) {
      console.error('Payment init error', err);
      this.toastr.error(typeof err === 'string' ? err : 'Payment initiation failed');
    }
  }

  showPopupForm(data: any) {
    this.showPopup = true;
    this.paymentData = data;

    // Prefill customer data into the popup form
    const { customer_name, customer_email, customer_panNo } = this.order.customer_details;
    this.form.patchValue({ name: customer_name, email: customer_email, panNo: customer_panNo });
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
      this.showPopup = false;
      this.resetOrderForm();
    } catch (err) {
      console.error('Certificate generation failed', err);
      this.message = 'Payment successful, but certificate could not be sent.';
    }
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
