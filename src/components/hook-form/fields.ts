import { InputField } from "./input-field";
import { RadioGroupField } from "./radio-field";
import { SelectField } from "./select-field";
import { NestedSelectField } from "./select-group-field";
import { SwitchField } from "./switch";
import { TextareaField } from "./text-area";

export const Field = {
  Text: InputField,
  Select: SelectField,
  Textarea: TextareaField,
  Switch: SwitchField,
  RadioGroup: RadioGroupField,
  NestedSelect: NestedSelectField,
};
