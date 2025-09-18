import Select, { ActionMeta, MultiValueGenericProps, components, type CSSObjectWithLabel } from 'react-select';

import Image, { StaticImageData } from 'next/image';

import { cn } from '@/lib/utils/css';

import CreatableSelect from 'react-select/creatable';
import CreateableAsyncSelect from 'react-select/async-creatable'

export type SelectValueBase = { value: string; label: string; img?: string | StaticImageData };
export type SelectValue = Omit<SelectValueBase, 'img'>;

export type SelectProps = {
  name: string;
  placeholder: string;
  options?: SelectValueBase[];
  loadOptions?: (searchVal: string, setOptions: (options: SelectValueBase[]) => void) => void;
  handleChange: (arg: readonly SelectValue[], meta?: ActionMeta<SelectValueBase>) => void;
  handleBlur?: () => void;
  isSearchable?: boolean;
  isCreatable?: boolean;
  isAsync?: boolean;
  className?: string;
  value?: readonly SelectValueBase[];
  controlStyles?: CSSObjectWithLabel;
  menuStyles?: CSSObjectWithLabel;
  menuListStyles?: CSSObjectWithLabel;
  optionStyles?: CSSObjectWithLabel;
};

const MultiValueContainer = (props: MultiValueGenericProps<SelectValueBase>) => {
  return (
    <div className="w-auto">
      <components.MultiValueContainer {...props} />
    </div>
  );
};

const MultiSelect = ({
  name,
  options,
  value,
  placeholder,
  handleChange,
  handleBlur,
  isSearchable = true,
  isCreatable = false,
  isAsync=false,
  ...props
}: SelectProps) => {
  const Comp = isAsync ? CreateableAsyncSelect : isCreatable ? CreatableSelect : Select;
  return (
    <Comp
      className={cn('text-capitalize px-0 ring-1 ring-neutral-300', props.className)}
      components={{ MultiValueContainer }}
      name={name}
      options={options}
      styles={{
        input: base => ({
          ...base,
          color: '#000',
        }),
        control: (base, state) => ({
          ...base,
          borderRadius: '8px',
          borderWidth: '2px',
          border: 'none',
          boxShadow: 'none',
          fontSize: 12,
          background: '#fff',
          '&:hover': {
            borderColor: '#045C5D',
          },
          ...props.controlStyles,
        }),
        menu: base => ({
          ...base,
          background: '#fff',
          boxShadow: 'none',
          border: '1px solid color-mix(in oklab, var(--primary) 90%, transparent);',
          borderRadius: '0.1rem',
          ...props.menuStyles,
        }),
        menuList: base => ({
          ...base,
          fontSize: '14px',
          borderRadius: '0.1rem',
          background: '#fff',
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          padding: 0,
          ...props.menuListStyles,
        }),
        option: (base, state) => ({
          ...base,
          color: '#000',
          fontSize: '12px',
          background: state.isFocused ? '#f5f5f5' : '',
          '&:active': {
            backgroundColor: '#f5f5f5',
          },
          ...props.optionStyles,
        }),
        multiValue: styles => ({
          ...styles,
          background: '#fff',
          color: '#000',
          border: '1px solid #dedcdc',
          borderRadius: '5px',
          justifyContent: 'space-between',
          padding: '4px 6px',
        }),
        multiValueLabel: styles => ({
          ...styles,
          color: '#000',
        }),
        multiValueRemove: styles => ({
          ...styles,
          color: '#525252',
          '&:hover': {
            backgroundColor: '#dedcdc',
            color: 'gray',
          },
        }),
        valueContainer: styles => ({
          ...styles,
          padding: 0,
        }),
        indicatorSeparator: styles => ({
          ...styles,
          display: 'none',
        }),
        dropdownIndicator: styles => ({
          ...styles,
          color: '#8f8b8b',
          '&:hover': {
            color: '#000',
          },
        }),
      }}
      value={value}
      isSearchable={isSearchable}
      placeholder={placeholder}
      onChange={(opt, meta) => {
        handleChange(opt, meta);
      }}
      onBlur={handleBlur}
      formatOptionLabel={option => (
        <div className="flex items-center gap-2">
          {option.img && <Image src={option.img} alt={'option-img'} style={{ width: '20px', borderRadius: '4px' }} />}
          <span>{option.label}</span>
        </div>
      )}
      isMulti
      loadOptions={(inputValue, setOptions) => props.loadOptions?.(inputValue, setOptions)}
      cacheOptions={true}
    />
  );
};

export { MultiSelect };

