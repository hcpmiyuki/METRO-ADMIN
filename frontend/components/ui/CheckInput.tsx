import { FC } from 'react'

type Props = {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: number;
  checked: boolean;
  customStyles?: string;
};

const defaultStyle = 'rounded';

const CheckInput: FC<Props> = ({ handleChange, value, checked, customStyles }) => {
  const styles = customStyles ? `${defaultStyle} ${customStyles}` : defaultStyle;
	return (
    <input
      type="checkbox"
      value={value}
      checked={checked}
      className={styles}
      onChange={handleChange}
    />
	)
}

export default CheckInput;