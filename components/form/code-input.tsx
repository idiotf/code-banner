'use client'

import { useFormContext } from 'react-hook-form'
import { FormField } from '../ui/form'
import clsx from 'clsx'

interface EditorProps extends React.HTMLProps<HTMLTextAreaElement> {
  name: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
}

export const Editor = ({ name, className, ...props }: EditorProps) => {
  const { control } = useFormContext()

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) =>
        <textarea
          {...props}
          {...field}
          className={clsx('resize-none block w-full bg-accent px-4 py-3 whitespace-nowrap', className)}
          spellCheck='false'
          autoCapitalize='none'
          autoCorrect='off'
          autoComplete='off'
        />
      }
    />
  )
}
