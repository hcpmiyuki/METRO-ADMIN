import { FC } from 'react'

type Props = {
  searchWord: string;
  handleChange: (event: any) => void;
};

const SearchInput: FC<Props> = ({ searchWord, handleChange }) => {
	return (
    <input type='text' value={searchWord} className="rounded w-5/6" onChange={handleChange}/>
	)
}

export default SearchInput;