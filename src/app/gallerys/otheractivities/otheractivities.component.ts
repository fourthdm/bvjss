import { Component } from '@angular/core';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import lgZoom from 'lightgallery/plugins/zoom';
@Component({
  selector: 'app-otheractivities',
  templateUrl: './otheractivities.component.html',
  styleUrls: ['./otheractivities.component.css']
})
export class OtheractivitiesComponent {
  settings = {
    counter: false,
    plugins: [lgZoom],
  };
  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
    console.log(index, prevIndex);
  };
}
