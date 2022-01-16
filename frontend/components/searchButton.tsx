import { FC } from 'react'
import Button from './button'

type Props = {
  handleSubmit: (event: any) => void;
};

const SearchButton: FC<Props> = ({ handleSubmit }) => {
	return (
    <Button
      handleSubmit={handleSubmit}
      styles="bg-slate-500 rounded-md w-1/6 pt-2"
      label="🔎"
    />
	)
}

export default SearchButton;