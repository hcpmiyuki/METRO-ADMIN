import { FC } from 'react'

type Props = {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue: string;
  customStyles?: string;
};

const defaultStyle = 'rounded';

const TextInput: FC<Props> = ({ handleChange, inputValue, customStyles }) => {
  const styles = customStyles ? `${defaultStyle} ${customStyles}` : defaultStyle;
	return (
    <input
      type='text'
      value={inputValue}
      className={styles}
      onChange={handleChange}
    />
	)
}

export default TextInput;