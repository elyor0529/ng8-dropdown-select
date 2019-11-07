import {Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Language} from '../language.model';
import {
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  Validator,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import {from, fromEvent, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, groupBy, map, mergeMap, reduce, switchMap, toArray} from 'rxjs/operators';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';

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

  @Input('options') items: Language[];

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  @Output('mapped') onChange = new EventEmitter();

  private registerChange = (_: any) => {
  };

  private renderGroup(items: Language[]) {
    from(items).pipe(
      groupBy(a => a.Code),
      mergeMap(g => g.pipe(toArray()))
    ).subscribe(val => {
      this.filterItems.push(val);
    });
  }

  selectedItem: Language;
  searchTerm: FormControl;
  filterItems: Language[][] = [];
  isActive: boolean;

  constructor(private eref: ElementRef) {
    this.searchTerm = new FormControl();
  }

  ngOnInit() {
    this.renderGroup(this.items);
    this.searchTerm.setValue('');

    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        map((e: any) => e.target.value),
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(term => {
          return of(this.items.filter(option => option.Name.toLowerCase().indexOf(term.toLowerCase()) > -1));
        }))
      .subscribe(list => {
        this.isActive = list.length > 0;

        this.renderGroup(list);
      });

    fromEvent(this.searchInput.nativeElement, 'focus')

      .subscribe(event => {

        this.isActive = this.items.length > 0;

        this.renderGroup(this.items);
      });
  }

  resetItem(event: any) {
    this.isActive = false;
    this.renderGroup(this.items);
    this.selectedItem = null;
    this.searchTerm.reset();
  }

  showItems(event: any) {
    this.isActive = true;
  }

  registerOnChange(fn: any): void {
    this.registerChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.selectedItem ? null : {required: true};
  }

  writeValue(obj: any): void {
    if (!obj) {
      return;
    }

    this.selectedItem = obj;
    this.searchTerm.setValue(obj['Name']);
  }

  chooseItem(item: Language) {
    this.isActive = false;
    this.registerChange(item);
    this.onChange.emit(item);
    this.selectedItem = item;
    this.searchTerm.setValue(item.Name);
    this.renderGroup(this.items);
  }


  closeDropdown(event) {
    if (!this.eref.nativeElement.contains(event.target)) {
      this.isActive = false;
      this.searchTerm.setValue(this.selectedItem ? this.selectedItem.Name : '');

      this.renderGroup(this.items);
    }
  }
}
