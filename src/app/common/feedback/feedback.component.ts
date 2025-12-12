import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  Blogs: any[] = [];

  Feedbackform: FormGroup;
  Allfeedback: any[] = [];

  showPopup = false;
  interval: any;

  constructor(private rest: RestService) {
    this.Feedbackform = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      contactno: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {

    this.Feedback();
    this.allBlog();
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

  closePopup() {
    this.showPopup = false;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  Addfeedback() {
    this.rest.Addfeedback(this.Feedbackform.value).subscribe((data: any) => {
      console.log(data)
      this.Allfeedback.push();
      this.Feedbackform.reset();
      this.closePopup();
    }, (err: any) => {
      console.log(err)
    })
  }

  Feedback() {
    this.rest.Allfeedback().subscribe((data: any) => {
      this.Allfeedback = data.data;
      console.log(data);
    }, (err: any) => {
      console.log(err);
    });
  }

  allBlog() {
    this.rest.AllBlogs().subscribe((data: any) => {
      console.log(data);
      this.Blogs = data.data;
    }, (err: any) => {
      console.log(err);
    })
  }

}