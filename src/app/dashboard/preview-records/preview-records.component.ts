import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview-records',
  templateUrl: './preview-records.component.html',
  styleUrls: ['./preview-records.component.css']
})
export class PreviewRecordsComponent implements OnInit {
  selectedRecord: string;

  constructor() { }

  ngOnInit(): void {
    this.selectedRecord = JSON.parse(localStorage.getItem("previewRecord"))
  }

}
