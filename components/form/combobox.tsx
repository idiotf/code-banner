import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Combobox as ComboboxComp, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '../ui/combobox'

interface ComboboxProps extends React.ComponentProps<typeof ComboboxComp> {
  name: string
  label?: React.ReactNode
  empty?: React.ReactNode
  placeholder?: string
}

export const Combobox = ({ name, label, empty, placeholder, ...props }: ComboboxProps) => {
  const { control } = useFormContext()

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) =>
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <ComboboxComp
              value={field.value}
              onValueChange={field.onChange}
              {...props}
            >
              <ComboboxInput placeholder={placeholder} />
              <ComboboxContent>
                <ComboboxEmpty>{empty}</ComboboxEmpty>
                <ComboboxList>
                  {item =>
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  }
                </ComboboxList>
              </ComboboxContent>
            </ComboboxComp>
          </FormControl>
          <FormMessage />
        </FormItem>
      }
    />
  )
}
