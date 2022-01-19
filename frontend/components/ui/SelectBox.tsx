import { FC } from 'react'

type Option = {
  value: string;
  text: string;
}

type Props = {
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  inputValue: string;
  options: Option[];
  customStyles?: string;
};

const defaultStyle = 'rounded';

const SelectBox: FC<Props> = ({ handleChange, inputValue, options, customStyles }) => {
  const styles = customStyles ? `${defaultStyle} ${customStyles}` : defaultStyle;
	return (
    <select
      value={inputValue}
      className={styles}
      onChange={handleChange}
    >
      {options.map((option, i) => {
        return <option value={option.value} key={i}>{option.text}</option>
      })}
    </select>
	)
}

export default SelectBox;