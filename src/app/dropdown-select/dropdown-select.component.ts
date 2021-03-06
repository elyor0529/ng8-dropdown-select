import {Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Language} from '../language.model';
import {
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ControlValueAccessor,
    Validator,
    ValidationErrors,
    AbstractControl, Validators
} from '@angular/forms';
import {from, fromEvent, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, groupBy, map, mergeMap, switchMap, toArray} from 'rxjs/operators';
import {DropdownGroup} from './dropdown-group.model';

@Component({
    selector: 'dropdown-select',
    templateUrl: './dropdown-select.component.html',
    styleUrls: ['./dropdown-select.component.scss'],
    host: {
        '(document:click)': 'closeDropdown($event)',
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropdownSelectComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DropdownSelectComponent),
            multi: true,
        }
    ]
})
export class DropdownSelectComponent implements OnInit, ControlValueAccessor, Validator {

    @Input('required') isRequired: boolean;
    @Input('options') items: Language[];
    @Input('group') groupBy: string;
    @Output('onChange') onChange = new EventEmitter();

    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;

    private registerChange = (_: any) => {
    };

    private renderGroup(items: Language[]) {

        const groups = Object.assign([], items).reduce((prev, curr) => {
            if (!prev[curr[this.groupBy]]) {
                prev[curr[this.groupBy]] = [curr];
            } else {
                prev[curr[this.groupBy]].push(curr);
            }
            return prev;
        }, {});

        this.filterItems = Object.keys(groups).map(key => ({
            name: key, options: groups[key]
        }));
    }

    selectedItem: Language;
    searchTerm: FormControl;
    filterItems: DropdownGroup[];
    isActive: boolean;

    constructor(private eref: ElementRef) {
    }

    ngOnInit() {

        this.searchTerm = this.isRequired
            ? new FormControl('', Validators.required)
            : new FormControl();

        fromEvent(this.searchInput.nativeElement, 'input')
            .pipe(
                map((e: any) => e.target.value),
                debounceTime(100),
                filter(res => res.length > 0),
                distinctUntilChanged(),
                switchMap(term => of(this.items.filter(option => option.Name.toLowerCase().indexOf(term.toLowerCase().trim()) != -1))))
            .subscribe(list => {

                this.isActive = list.length > 0;

                this.renderGroup(list);
            });

        fromEvent(this.searchInput.nativeElement, 'focus')

            .subscribe(event => {

                this.isActive = this.items.length > 0;

                this.renderGroup(this.items);

                if (this.selectedItem) {

                    setTimeout((tagId) => {

                        document.getElementById('lang-option-' + tagId).scrollIntoView({
                            behavior: 'auto',
                            block: 'center'
                        });

                    }, 50, this.selectedItem.Lcid);
                }

            });
    }

    resetItem(event: any) {
        this.isActive = false;
        this.selectedItem = null;
        this.searchTerm.setValue('');
        this.onChange.emit(null);
    }

    showItems(event: any) {
        this.isActive = true;
        this.renderGroup(this.items);
    }

    registerOnChange(fn: any): void {
        this.registerChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.selectedItem ? null : {required: this.isRequired};
    }

    writeValue(obj: any): void {
        if (!obj) {
            return;
        }

        this.selectedItem = obj;
        this.searchTerm.setValue(obj ? obj['Name'] : '');
    }

    chooseItem(item: Language) {
        this.isActive = false;
        this.selectedItem = item;
        this.searchTerm.setValue(item ? item.Name : '');
        this.onChange.emit(item);
    }

    closeDropdown(event) {
        if (!this.eref.nativeElement.contains(event.target)) {
            this.isActive = false;
            this.searchTerm.setValue(this.selectedItem ? this.selectedItem.Name : '');
            this.onChange.emit(this.selectedItem);
        }
    }
}
