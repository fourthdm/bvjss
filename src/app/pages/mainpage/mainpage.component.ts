import { Component } from '@angular/core';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import lgZoom from 'lightgallery/plugins/zoom';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent {
 settings = {
     counter: false,
     plugins: [lgZoom],
   };
   onBeforeSlide = (detail: BeforeSlideDetail): void => {
     const { index, prevIndex } = detail;
     console.log(index, prevIndex);
   };
}
