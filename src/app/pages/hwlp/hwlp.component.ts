import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CashfreeserviceService } from 'src/app/services/cashfreeservice.service';
import { load } from '@cashfreepayments/cashfree-js';
import confetti from 'canvas-confetti';
import { RestService } from 'src/app/services/rest.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

declare var bootstrap: any;

declare const Cashfree: any;

@Component({
  selector: 'app-hwlp',
  templateUrl: './hwlp.component.html',
  styleUrls: ['./hwlp.component.css']
})
export class HwlpComponent {

  @ViewChild('donationModal') donationModal!: ElementRef;

  closeModal() {
    const modalElement = this.donationModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.hide();
  }

  cashfree: any;
  donationform: FormGroup;
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
    {
      label: 'Milk (One Time)', amount: 2000, img: '/assets/snacks/1.png', donate:"https://payments.cashfree.com/forms/bvjss" },
    { label: 'Fruits (One Time)', amount: 3000, img: '/assets/snacks/2.png',donate:"https://payments.cashfree.com/forms/fruits" },
    { label: 'Breakfast (One Time)', amount: 4000, img: '/assets/snacks/7.png',donate:"https://payments.cashfree.com/forms/bvjssbreakfast" },
    { label: 'Lunch With Sweet (One Time)', amount: 8000, img: '/assets/snacks/6.png',donate:"https://payments.cashfree.com/forms/lunch" },
    { label: 'Dinner With Sweet (One Time)', amount: 8000, img: '/assets/snacks/4.png',donate:"https://payments.cashfree.com/forms/lunch" },
    { label: 'Evening Snacks (One Time)', amount: 3500, img: '/assets/snacks/5.png',donate:"https://payments.cashfree.com/forms/snack" }
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
    private rest: RestService,
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

    this.donationform = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      contactNo: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required])
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

            //  Close the donation modal first
            this.closeModal();

            //  Show spinner immediately
            this.spinner.show(undefined, {
              type: 'ball-scale-multiple',
              size: 'medium',
              bdColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fullScreen: true
            });

            //  Start certificate generation
            this.http.post('http://localhost:8000/generate-certificate', {
              name: customer_name,
              email: customer_email,
              panNo: customer_panNo
            }).subscribe({
              next: () => {
                //  Hide spinner
                this.spinner.hide();

                //  UI updates inside Angular zone
                this.zone.run(() => {
                  this.launchConfetti(); //  Animation
                  this.toastr.success('Your certificate has been sent!', 'Success'); //  Toastr
                  this.resetOrderForm(); // Reset form
                });
              },
              error: () => {
                this.spinner.hide();
                this.zone.run(() => {
                  this.toastr.error('Certificate generation failed.', 'Error');
                });
              }
            });
          }
        });
        // checkoutPromise.then((result: any) => {
        //   if (result.paymentDetails) {
        //     const { customer_name, customer_email, customer_panNo } = this.order.customer_details;

        //     this.closeModal(); //  Close modal here
        //     this.spinner.show(undefined, {
        //       type: 'ball-scale-multiple',
        //       size: 'medium',
        //       bdColor: 'rgba(0,0,0,0.6)',
        //       color: '#fff',
        //       fullScreen: true
        //     });

        //     this.http.post('http://localhost:8000/generate-certificate', {
        //       name: customer_name,
        //       email: customer_email,
        //       panNo: customer_panNo
        //     }).subscribe({
        //       next: () => {
        //         this.spinner.hide();
        //         // this.closeModal();
        //         this.message = 'Certificate sent on your email!';
        //         this.toastr.success('Your certificate has been sent!', 'Success');
        //         this.launchConfetti();
        //       },
        //       error: () => {
        //         // this.spinner.hide();
        //         // this.toastr.error('Failed to send certificate.', 'Error');
        //       }
        //     });
        //     this.zone.run(() => {
        //       this.toastr.success('Your certificate has been sent!', 'Success');
        //       this.launchConfetti();
        //       this.resetOrderForm();
        //     });
        //     // this.zone.run(() => {
        //     //   this.showPopupForm(result.paymentDetails);
        //     //   this.resetOrderForm();
        //     // });
        //   }
        // });
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

  Donation() {
    this.rest.Donate(this.donationform.value).subscribe((data: any) => {
      console.log(data);
      this.donationform.reset();
    }, (err: any) => {
      console.log(err);
    })
  }

  // grocery selected form
  selectedItems: string[] = [];

  onCheckboxChange(item: string, event: any) {
    if (event.target.checked) {
      this.selectedItems.push(item);
    } else {
      const index = this.selectedItems.indexOf(item);
      if (index >= 0) this.selectedItems.splice(index, 1);
    }

    // Update the message form control
    const message = this.selectedItems.join(', ');
    this.donationform.patchValue({ message });
  }

  groceryItems = [
    'Rice', 'Atta', 'Moong', 'Cooking Oil', 'Tur Dal',
    'Moong Dal', 'Chavli', 'Vatana', 'Matki', 'Pohe',
    'Akha Moong', 'Akha Masoor', 'Sugar', 'Mirchi Powder',
    'Haldi', 'Sabji Masala', 'Pulav Masala', 'Goda Masala',
    'Shengdana', 'Chana', 'Chole', 'Jire', 'Mohri',
    'Suji', 'Rajma', 'Soyabin Vadi', 'Hygience Kit', 'Medicine'
  ];
}
