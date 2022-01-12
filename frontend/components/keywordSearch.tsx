import { FC } from 'react'
import SearchButton from './searchButton'
import SearchInput from './searchInput'

type Props = {
  searchWord: string;
  handleChange: (keyword: string) => void;
  handleSubmit: (event: any) => void;
};

const KeywordSearch: FC<Props> = ({ searchWord, handleChange, handleSubmit }) => {
	return (
    <div className='flex space-x-2'>
      <SearchInput searchWord={searchWord} handleChange={(event) => handleChange(event.target.value)} />
      <SearchButton handleSubmit={handleSubmit}/>
    </div>
	)
}

export default KeywordSearch;