import { FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils{
  //Expresión regular
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static academicYearPattern = '[0-9]{4,4}-[0-9]{4,4}';

  static getTextError(errors: ValidationErrors){
        for( const key of Object.keys(errors)){
            switch(key){
                case 'required':
                return 'Este campo es requerido';
                case 'email':
                return `El valor introducido no es un correo electrónico`;
                case 'pattern':
                    if(errors['pattern'].requiredPattern === FormUtils.emailPattern){
                        return "El valor introducido no es un correo electrónico";
                    }
                    if(errors['pattern'].requiredPattern === FormUtils.academicYearPattern){
                        return "El valor introducido no tiene el formato de año académico válido";
                    }
                return 'Error de patrón contra expresión regular';
                case 'emailTaken':
                return 'El correo introducido no existe';
                case 'min':
                return 'Debes introducir una cantidad mayor que 0';
                default:
                return `Error de validación no controlado ${key}`;
            }
        }
        return null;
    }
    static isValidField(form: FormGroup, fieldName: string) : boolean|null{
        return (form.controls[fieldName].errors && form.controls[fieldName].touched);
    }
}
