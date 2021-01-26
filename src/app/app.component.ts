import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'demo-primeng';

  constructor(private config: PrimeNGConfig, private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');

    const browserLang = this.translate.getBrowserLang();
    console.log(browserLang);
    this.translate.use(browserLang.match(/en|pt/) ? browserLang : 'pt')

    this.config.ripple = true;
  }

  setTranslate(lang: string) {
    this.translate.use(lang);
    this.translate.get('primeng').subscribe(res => this.config.setTranslation(res));
  }
}
