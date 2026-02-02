import { useCallback } from 'react'
import { useFormContext, useWatch, type ControllerRenderProps, type FieldPath } from 'react-hook-form'
import type { FormSchema } from '../banner-creator/options'

import { Input as InputComp } from '../ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

const useBannerFormContext = useFormContext<FormSchema>

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
  name: FieldPath<FormSchema>
}

export const Input = ({ name, label, ...props }: InputProps) => {
  const { control } = useBannerFormContext()

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) =>
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputComp {...props} {...field} value={field.value ?? ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      }
    />
  )
}

function clamp(x: number, min?: string | number, max?: string | number) {
  if (min != null && x < +min) x = +min
  if (max != null && +max < x) x = +max
  return x
}

const NumberInputField = ({ name, field, props }: {
  name: FieldPath<FormSchema>
  field: ControllerRenderProps<FormSchema, FieldPath<FormSchema>>
  props: React.HTMLProps<HTMLInputElement>
}) => {
  const form = useBannerFormContext()
  const value = useWatch({
    control: form.control,
    name,
  })

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const v = clamp(event.target.valueAsNumber, props.min, props.max)
    if (isNaN(v)) {
      field.onChange(undefined)
    } else {
      field.onChange(v)
    }
  }, [props.min, props.max, field])

  return (
    <FormItem>
      <FormLabel>{props.label}</FormLabel>
      <FormControl>
        <InputComp
          {...props}
          {...field}
          value={value ?? ''}
          type='number'
          onChange={onChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export const NumberInput = ({ name, ...props }: InputProps) => {
  const form = useBannerFormContext()

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) =>
        <NumberInputField name={name} field={field} props={props} />
      }
    />
  )
}
