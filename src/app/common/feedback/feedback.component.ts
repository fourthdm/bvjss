import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  showPopup = false;
  enquiryData = { name: '', email: '', message: '' }; // Form data model
  interval: any;

  constructor() { }

  ngOnInit(): void {

    this.showPopup = true;

    // this.interval = setInterval(() => {
    //   this.showPopup = true;
    // }, (1000));
  }

  @HostListener('document:keydown.escape', ['$event']) // Listen for Esc key press
  handleEscapeKey(event: KeyboardEvent) {
    if (this.showPopup) {
      this.closePopup();
    }
  }

  submitEnquiry() {
    console.log('Form submitted', this.enquiryData)
    this.closePopup();
  }

  closePopup() {
    this.showPopup = false;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
