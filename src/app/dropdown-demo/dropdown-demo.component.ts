import {Component, OnInit} from '@angular/core';
import {Language} from '../language.model';

@Component({
  selector: 'app-dropdown-demo',
  templateUrl: './dropdown-demo.component.html',
  styleUrls: ['./dropdown-demo.component.scss']
})
export class DropdownDemoComponent implements OnInit {

  items: Language[] = [];

  constructor() {
    let langs = [];

    for (let i = 0; i < 100; i++) {
      langs.push(<Language> {
        RightToLeft: false,
        Code: 'Automation' + i % 10,
        Lcid: i,
        Mapped: i % 2 == 0,
        Name: 'Automation' + i
      });
    }

    this.items = langs;
  }

  ngOnInit() {
  }

}
