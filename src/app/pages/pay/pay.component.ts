import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


declare const Cashfree: any;

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent {

  order = {
    order_id: `ORDER${Date.now()}`,
    order_amount: '',
    customer_details: {
      customer_name: '',
      customer_id: `CUST${Date.now()}`,
      customer_email: '',
      customer_phone: '',
      customer_panNo: ''
    }
  };

  constructor(private http: HttpClient, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  // async initiatePayment() {
  //   try {
  //     const res: any = await this.http.post('https://ysurveillance.com/BvjssBackend/token', this.order).toPromise();
  //     const sessionId = res.payment_session_id;

  //     if (!sessionId) {
  //       this.toastr.error('Session ID invalid');
  //       return;
  //     }

  //     Cashfree.checkout({
  //       paymentSessionId: sessionId,
  //       redirectTarget: '_modal',
  //       mode: 'PROD'
  //     });
  //   } catch (err) {
  //     console.error('Payment initiation failed', err);
  //     this.toastr.error('Failed to initiate payment');
  //   }
  // }


  initiatePayment() {
  const orderData = {
    order_amount: '',
    order_currency: "INR",
    order_id: 'ORDER_' + Date.now(),
    customer_details: {
      customer_id: '',
      customer_email: '',
      customer_phone: '',
      customer_name: '',
      customer_panNo: ''
    }
  };

  this.http.post('http://localhost:8000/create-order', orderData).subscribe((res: any) => {
    const paymentSessionId = res.payment_session_id;

    if (!paymentSessionId) {
      console.error("Token is missing!", res);
      return;
    }

    Cashfree.checkout({
      paymentSessionId: paymentSessionId,
      mode: 'PROD',
      redirectTarget: '_modal'
    });
  });
}

// initiatePayment() {
//   this.http.post('https://ysurveillance.com/BvjssBackend/token', this.order).subscribe({
//     next: (res: any) => {
//       if (res.payment_session_id && typeof Cashfree?.checkout === 'function') {
//         Cashfree.checkout({
//           paymentSessionId: res.payment_session_id,
//           redirectTarget: '_modal',
//           mode: 'PROD' // or 'SANDBOX' for testing
//         });
//       } else {
//         console.error('Cashfree.checkout not available', Cashfree);
//       }
//     },
//     error: (err) => {
//       console.error('Error getting token', err);
//     }
//   });
// }
}