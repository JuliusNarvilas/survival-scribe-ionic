import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AppIOService } from 'src/app/shared/AppIOService';

@Component({
  selector: 'app-landing',
  templateUrl: 'landing.page.html',
  styleUrls: ['landing.page.scss']
})
export class LandingPage implements OnInit {

  constructor(private ioService: AppIOService, private router: Router, private plt: Platform) {
  }

  displayText: string;
  currentState = 0;

  ngOnInit(): void {
    if (this.ioService.isReady()) {
      this.router.navigateByUrl('/tabs/tab1');
    }



    this.ioService.initilise(this.plt, () => {
      this.initAppSettings();
    });
  }

  initAppSettings() {
    this.ioService.ReadText('SurvivalScribe.config', (content: string) => {
      
    });
  }

}
