import { Component } from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent {
  billingCycle = 'custom';
  selectedDuration = '15 Days';

  durations = ['15 Days', '3 Month', '6 Month', '9 Month'];

  plans = [
    {
      name: 'Basic',
      price: 25,
      features: [
        { text: 'Lorem ipsum dolor amet.', available: true },
        { text: 'Consecuer adicing elit.', available: true },
        { text: 'Sed diam nonorum euism.', available: true },
        { text: 'Tincint laoreet iam dolore.', available: true },
        { text: 'Magna aliquam eratn.', available: false },
        { text: 'Sed diam nonorum euism.', available: false },
        { text: 'Cons eouar adipi scing.', available: false },
      ],
      color: 'blue'
    },
    {
      name: 'Pro',
      price: 25,
      features: [
        { text: 'Lorem ipsum dolor amet.', available: true },
        { text: 'Consecuer adicing elit.', available: true },
        { text: 'Sed diam nonorum euism.', available: true },
        { text: 'Tincint laoreet iam dolore.', available: true },
        { text: 'Magna aliquam eratn.', available: true },
        { text: 'Sed diam nonorum euism.', available: false },
        { text: 'Cons eouar adipi scing.', available: false },
      ],
      color: 'orange'
    },
    {
      name: 'Premium',
      price: 25,
      features: [
        { text: 'Lorem ipsum dolor amet.', available: true },
        { text: 'Consecuer adicing elit.', available: true },
        { text: 'Sed diam nonorum euism.', available: true },
        { text: 'Tincint laoreet iam dolore.', available: true },
        { text: 'Magna aliquam eratn.', available: true },
        { text: 'Sed diam nonorum euism.', available: true },
        { text: 'Cons eouar adipi scing.', available: true },
      ],
      color: 'green'
    }
  ];

  selectBilling(type: string) {
    this.billingCycle = type;
  }

  selectDuration(duration: string) {
    this.selectedDuration = duration;
  }
}