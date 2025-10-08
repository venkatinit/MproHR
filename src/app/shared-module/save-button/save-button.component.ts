import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent implements OnInit {
  constructor() { }
  @Input() disabled: boolean;
  @Input() spin: boolean

  ngOnInit() {
  }

}