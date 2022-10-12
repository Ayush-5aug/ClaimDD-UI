import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wafooter',
  templateUrl: './wafooter.component.html',
  styleUrls: ['./wafooter.component.css']
})
export class WAfooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openNewTab(url: any) {
    window.open(url, '_blank');
  }

}
