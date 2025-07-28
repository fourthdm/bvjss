import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EthonComponent } from './gallerys/ethon/ethon.component';
import { SkillsComponent } from './gallerys/skills/skills.component';
import { PabalComponent } from './gallerys/pabal/pabal.component';
import { OtheractivitiesComponent } from './gallerys/otheractivities/otheractivities.component';
import { SportsComponent } from './gallerys/sports/sports.component';
import { IndepencedayComponent } from './gallerys/indepenceday/indepenceday.component';
import { AnnualComponent } from './gallerys/annual/annual.component';
import { BreakfastComponent } from './gallerys/breakfast/breakfast.component';
import { RefundpolicyComponent } from './common/refundpolicy/refundpolicy.component';
import { FeedbackComponent } from './common/feedback/feedback.component';
import { TermconditionComponent } from './common/termcondition/termcondition.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { MediacoverageComponent } from './pages/mediacoverage/mediacoverage.component';
import { InitiativesComponent } from './pages/initiatives/initiatives.component';
import { HistoryComponent } from './pages/history/history.component';
import { HwlpComponent } from './pages/hwlp/hwlp.component';
import { ContactusComponent } from './common/contactus/contactus.component';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { HelpinghandComponent } from './pages/helpinghand/helpinghand.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'BVJSS- Bhatkya Vimukt Jati Shikshan Sanstha is a best  NGO for Education & Empowerment' },
  { path: '', component: HomeComponent, title: 'BVJSS- Bhatkya Vimukt Jati Shikshan Sanstha | NGO for Education & Empowerment' },
  { path: 'Aboutus', component: AboutComponent, title: 'About Us | Bhatkya Vimukt Jati Shikshan Sanstha - Trusted NGO in India' },
  { path: 'HelpingHands', component: HelpinghandComponent, title: 'Join Helping Hands | Volunteer or Support BVJSS NGO Initiatives' },
  { path: 'PabalSchool', component: MainpageComponent, title: 'Pabal School Is Mentally challenged child - Trusted Diyangang School in Maharastra' },
  { path: 'contact', component: ContactusComponent, title: 'Contact BVJSS | Reach Out to Our NGO Office & Support Team' },
  { path: 'howhelp', component: HwlpComponent, title: 'Donate to BVJSS | Support Education for Bhatkya Vimukt Communities' },
  { path: 'history', component: HistoryComponent, title: 'Our Journey | History of Bhatkya Vimukt Jati Shikshan Sanstha' },
  { path: 'Initiative', component: InitiativesComponent },
  { path: 'mediacoverage', component: MediacoverageComponent, title: 'Media Coverage | BVJSS NGO in News & Social Impact Stories' },
  { path: 'payment', component: PaymentsComponent },
  { path: 'gallery', component: GalleryComponent, title: 'Gallery | BVJSS NGO Activities, Events & Community Impact' },
  // { path: 'blogs', component: BlogsComponent },
  // { path: 'video', component: VideoComponent },
  { path: 'TermsConditions', component: TermconditionComponent, title: 'Terms & Condiitons | BVJSS NGO' },
  { path: 'Feedback', component: FeedbackComponent, title: 'Share Your Feedback | BVJSS NGO - We Value Your Voice' },
  { path: 'RefundPolicy', component: RefundpolicyComponent, title: 'Refund & Return Policy | BVJSS NGO' },

  // { path: 'blog/blog1', component: Blog1Component },
  // { path: 'blog/blog2', component: Blog2Component },
  // { path: 'blog/blog3', component: Blog3Component },
  // { path: 'blog/blog4', component: Blog4Component },
  // { path: 'blog/blog5', component: Blog5Component },

  { path: 'gallery/breakfast', component: BreakfastComponent },
  { path: 'gallery/annual', component: AnnualComponent },
  { path: 'gallery/indepenceday', component: IndepencedayComponent },
  { path: 'gallery/sports', component: SportsComponent },
  { path: 'gallery/otheractivities', component: OtheractivitiesComponent },
  { path: 'gallery/pabal', component: PabalComponent },
  { path: 'gallery/skill', component: SkillsComponent },
  { path: 'gallery/Inaugation', component: EthonComponent },
  { path: "**", redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
