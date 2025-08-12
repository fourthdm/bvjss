import { Component, OnInit } from '@angular/core';

declare var Cashfree: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bvjss';

  scrolltotop = document.getElementById("scrolltotop");
  rootelement = document.documentElement

  scroll() {
    this.rootelement.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }


}
