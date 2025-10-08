import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-offer-letter',
  templateUrl: './offer-letter.component.html',
  styleUrls: ['./offer-letter.component.scss']
})
export class OfferLetterComponent {

  addOfferLetter: FormGroup;
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  spinLoader = false;
  message: string | undefined;
  isSelected:any;
  isDisplayed = true;
  constructor(private formBuilder: FormBuilder) { }
 

  ngOnInit(): void {
    this.addOfferLetter= this.formBuilder.group({
      emp_code: ['', [Validators.required]],
      offer_date: ['', [Validators.required]],
      emp_name: ['', [Validators.required]],
      emp_addr: ['', [Validators.required]],
      join_date: ['', [Validators.required]],
      offer_designation: ['', [Validators.required]],
      offer_ctc: ['', [Validators.required]],

   
  
    
    });
 
  }
  get f() {
    return this.addOfferLetter.controls;
  }

  offer_letter=
  {'id':'NG0001','offer_date':'23-12-2023','emp_name':'Venkat','address':'Madhapur','join_date':'02-02-2024','offer_designation':'Angular Developer','offer_ctc':'240000 LPA'}
saveaddOfferLetter() {
    this.submitted = true;

    if (!this.addOfferLetter.valid) {
      return;
    }
    this.spinLoader = true;
    

  

  }
  showMe()
  {
      if(this.isDisplayed)
      {
          this.isDisplayed = false;
      }else{
          this.isDisplayed = true;
      }
  }


}
