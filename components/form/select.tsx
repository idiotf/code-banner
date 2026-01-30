import { useFormContext } from 'react-hook-form'
import { FormField } from '../ui/form'
import { SelectContent, Select as SelectRoot, SelectTrigger, SelectValue, SelectItem } from '../ui/select'

export { SelectItem }

export const Select = ({ name, placeholder, children }: React.PropsWithChildren<{
  name: string
  placeholder?: string
}>) => {
  const { control } = useFormContext()

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) =>
        <SelectRoot
          value={field.value}
          onValueChange={field.onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {children}
          </SelectContent>
        </SelectRoot>
      }
    />
  )
}
