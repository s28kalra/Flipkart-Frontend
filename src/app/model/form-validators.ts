import { FormControl, ValidationErrors } from "@angular/forms";

export class FlipkartValidators{

    static notOnlyWhiteSpace(control: FormControl): ValidationErrors{

        if(control.value!=null && control.value.trim().length==0)
            return {'notOnlyWhiteSpace': true};
        return {};

    }
}