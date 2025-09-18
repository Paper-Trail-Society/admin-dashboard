import { Control, useFormState } from "react-hook-form";

import { FormControl, FormField, FormItem, FormMessage } from "./form";
import { Input, InputProps } from "./input";
import { Label } from "./label";

export interface TextFieldProps extends InputProps {
  control: Control<any, any>;
  name: string;
  label?: string;
}

function TextField({
  control,
  name,
  label,
  placeholder = name,
  ...rest
}: TextFieldProps) {
  const { touchedFields, errors } = useFormState({ control });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="pb-2">
          <Label className="md:text-lg text-sm text-text font-bold">
            {label && label}
          </Label>
          <div className="relative">
            <FormControl>
              <div>
                <Input placeholder={placeholder} {...rest} {...field} />
              </div>
            </FormControl>
          </div>
          {touchedFields[name] && errors[name] && (
            <FormMessage className="text-xs text-rose-600" />
          )}
        </FormItem>
      )}
    />
  );
}

export default TextField;
