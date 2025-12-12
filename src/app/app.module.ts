import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { ContactusComponent } from './common/contactus/contactus.component';
import { FeedbackComponent } from './common/feedback/feedback.component';
import { FooterComponent } from './common/footer/footer.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { RefundpolicyComponent } from './common/refundpolicy/refundpolicy.component';
import { TermconditionComponent } from './common/termcondition/termcondition.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { HelpinghandComponent } from './pages/helpinghand/helpinghand.component';
import { HistoryComponent } from './pages/history/history.component';
import { HwlpComponent } from './pages/hwlp/hwlp.component';
import { InitiativesComponent } from './pages/initiatives/initiatives.component';
import { MediacoverageComponent } from './pages/mediacoverage/mediacoverage.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { AnnualComponent } from './gallerys/annual/annual.component';
import { BreakfastComponent } from './gallerys/breakfast/breakfast.component';
import { EthonComponent } from './gallerys/ethon/ethon.component';
import { IndepencedayComponent } from './gallerys/indepenceday/indepenceday.component';
import { OtheractivitiesComponent } from './gallerys/otheractivities/otheractivities.component';
import { PabalComponent } from './gallerys/pabal/pabal.component';
import { SkillsComponent } from './gallerys/skills/skills.component';
import { SportsComponent } from './gallerys/sports/sports.component';
// import { LightGallery } from 'lightgallery/lightgallery';
import { LightgalleryModule } from 'lightgallery/angular';
import { NgOptimizedImage } from '@angular/common';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PayComponent } from './pages/pay/pay.component';
import { DonComponent } from './pages/don/don.component';


@NgModule({
  declarations: [
    AppComponent,
    ContactusComponent,
    FeedbackComponent,
    FooterComponent,
    NavbarComponent,
    RefundpolicyComponent,
    TermconditionComponent,
    HomeComponent,
    AboutComponent,
    BlogsComponent,
    GalleryComponent,
    HelpinghandComponent,
    HistoryComponent,
    HwlpComponent,
    InitiativesComponent,
    MediacoverageComponent,
    PaymentsComponent,
    AnnualComponent,
    BreakfastComponent,
    EthonComponent,
    IndepencedayComponent,
    OtheractivitiesComponent,
    PabalComponent,
    SkillsComponent,
    SportsComponent,
    MainpageComponent,
    PayComponent,
    DonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    ToastrModule.forRoot({
      positionClass: 'toast-top-center', // Position at top center
      preventDuplicates: true,
    }),
    LightgalleryModule,
    NgOptimizedImage,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
