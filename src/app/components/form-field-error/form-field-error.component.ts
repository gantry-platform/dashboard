import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-field-error',
  templateUrl: './form-field-error.component.html',
  styleUrls: ['./form-field-error.component.scss']
})
export class FormFieldErrorComponent {

  @Input() viewError: boolean;
  @Input() errorMsg: string;

}
