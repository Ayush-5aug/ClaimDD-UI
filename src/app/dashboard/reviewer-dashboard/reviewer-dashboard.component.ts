import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: 'app-reviewer-dashboard',
  templateUrl: './reviewer-dashboard.component.html',
  styleUrls: ['./reviewer-dashboard.component.css']
})
export class ReviewerDashboardComponent implements OnInit {

  userData: any;
  reviewerId : any;
  reviewerData: any;
  selectedReviewerData: any;
    source: string = 'data';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData)
    if (!this.userData.isReviewer) {
      this.router.navigate(["/User"]);
    }
    this.authService.getReviewerId(this.userData['email']).subscribe((res) => {
      this.reviewerId = res
      console.log(res)
    }), (err) => {
      console.log(err)
    }
    setTimeout (() => {
      this.authService.getReviewerData(this.reviewerId).subscribe((res) => {
        this.reviewerData = res
        console.log(res)
      }), (err) => {
        console.log(err)
      }
    }, 1000);
  }

  openClaim(index: any) {
    console.log(index)
    this.selectedReviewerData = this.reviewerData[index];
    localStorage.setItem("selectedReviewerData", JSON.stringify(this.selectedReviewerData));
    localStorage.setItem("selectedProject", JSON.stringify(this.reviewerData[index]['projectId']));
    localStorage.setItem("currentClaim", JSON.stringify(this.reviewerData[index]['claim']));
    localStorage.setItem("selectedClaimant", JSON.stringify(this.reviewerData[index]['claimantId']));
    this.router.navigate(["User/claim"]);
  }

}
