import { ComponentProps, forwardRef } from 'react';

interface InputProps {
  className?: string;
  inputClassName?: string;
  input: ComponentProps<'input'>;
  label?: string;
  message?: string;
}

type Ref = HTMLInputElement;

const Input = forwardRef<Ref, InputProps>(
  ({ message, inputClassName, className, input, label }, ref) => {
    return (
      <div className={`${className} mb-4`}>
        {label && (
          <div className="flex items-center gap-2 mb-2">
            <label className="block" htmlFor={input.id}>
              {label}
            </label>
          </div>
        )}

        <input
          ref={ref}
          className={`${inputClassName} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block w-full p-2 mb-1`}
          {...input}
        />
        {message && <p className="text-sm text-gray-500">{message}</p>}
      </div>
    );
  }
);

export default Input;
