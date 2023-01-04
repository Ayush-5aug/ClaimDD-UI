import { Component, OnInit } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-contemporary-records',
  templateUrl: './contemporary-records.component.html',
  styleUrls: ['./contemporary-records.component.css']
})
export class ContemporaryRecordsComponent implements OnInit {
  selected: string;
  uploadDocForm: FormGroup;
  modalReference: any;

  constructor(private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.uploadDocForm = new FormGroup({
      documentDate: new FormControl(Date, [Validators.required]),
      file: new FormControl(File, [Validators.required]),
    });
  }

  onPreview() {
    localStorage.setItem(
      "previewRecord",
      JSON.stringify(this.selected)
    );
    this.router.navigate(["User/preview-records"]);
  }

  openUploadForm(content: any) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.closed.subscribe((data: any) => {
      this.uploadDocForm.reset();
    });
    this.modalReference.dismissed.subscribe((data: any) => {
      this.uploadDocForm.reset();
    });
  }

  onUpload() {
    
  }

}
