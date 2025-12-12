import { Component, OnInit } from '@angular/core';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import lgZoom from 'lightgallery/plugins/zoom';
import { RestService } from 'src/app/services/rest.service';
@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css']
})
export class SportsComponent implements OnInit {
  settings = {
    counter: false,
    plugins: [lgZoom],
  };
  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
    console.log(index, prevIndex);
  };

  Gallerys: any[] = [];

  constructor(private rest: RestService) { }

  ngOnInit(): void {
    this.BYDepartment();
  }

  BYDepartment() {
    const selcteddepartment = ['Sports Activities']
    this.rest.AllGallerybyDepartment({ department: selcteddepartment }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.Gallerys = data.data;
      } else {
        this.Gallerys = [];
      }
    }, (err: any) => {
      console.log(err);
    });
  }

}
