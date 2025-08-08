import { Component, OnInit } from '@angular/core';

declare var Cashfree: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'bvjss';

  scrolltotop = document.getElementById("scrolltotop");
  rootelement = document.documentElement

  scroll() {
    this.rootelement.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  ngOnInit(): void {
    const script = document.createElement('script');
  script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
  script.onload = () => {
    console.log('Cashfree SDK Loaded:', typeof (window as any).Cashfree.checkout);
  };
  document.body.appendChild(script);
    // console.log('Cashfree:', typeof Cashfree); // should show 'object'
    // if (Cashfree?.checkout) {
    //   console.log('Cashfree.checkout is available');
    // } else {
    //   console.error('Cashfree.checkout is NOT a function');
    // }
  }
}
