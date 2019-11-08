import {Component, OnInit} from '@angular/core';
import {Language} from '../language.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-dropdown-demo',
    templateUrl: './dropdown-demo.component.html',
    styleUrls: ['./dropdown-demo.component.scss']
})
export class DropdownDemoComponent implements OnInit {

    items: Language[] = [];
    selectedItem: Language;
    profileForm: FormGroup;

    constructor() {
        let langs = [];

        for (let i = 0; i < 1000; i++) {
            langs.push(<Language> {
                RightToLeft: false,
                Code: (i % 200 == 0) ? 'Automation' : 'Monitors',
                Lcid: i,
                Mapped: (i % 200 == 0) ? false : (i % 25 == 0),
                Name: 'Option ' + i
            });
        }

        this.items = langs;
    }

    ngOnInit() {
        this.profileForm = new FormGroup({
            selectedItem: new FormControl('', Validators.required)
        });
    }

    onSubmit(event) {
        console.log(event);
    }

    onChange(event) {

        this.selectedItem = event;

        console.log('Selected item ', event);
    }

}
