import { Component } from '@angular/core';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import lgZoom from 'lightgallery/plugins/zoom';
@Component({
  selector: 'app-pabal',
  templateUrl: './pabal.component.html',
  styleUrls: ['./pabal.component.css']
})
export class PabalComponent {
  settings = {
    counter: false,
    plugins: [lgZoom],
  };
  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
    console.log(index, prevIndex);
  };

}