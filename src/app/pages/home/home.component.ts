import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  scrolltop = document.getElementById('scrolltop');
  rootelement = document.documentElement;

  scroll() {
    this.rootelement.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  ngAfterViewInit() {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    // If embed.js is already loaded
    script.onload = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
    };
  }

  Reports: any[] = [];

  LatestUpdate: any[] = [];

  constructor(private rest: RestService) { }

  ngOnInit(): void {
    this.Allreport();
    this.AllLatestUpdate();
  }

  Allreport() {
    this.rest.AllDailyReport().subscribe((data: any) => {
      this.Reports = data.data;
      console.log(data);
    }, (err: any) => {
      console.log(err);
    });
  }

  AllLatestUpdate() {
    this.rest.AlllatestUpdate().subscribe((data: any) => {
      this.LatestUpdate = data.data;
      console.log(data);
    }, (err: any) => {
      console.log(err);
    })
  }

}
