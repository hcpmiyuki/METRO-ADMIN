import { FC } from 'react'
import Button from '../../ui/button';
import TextInput from '../../ui/TextInput';
import SelectBox from '../../ui/SelectBox';

type TagStatus = 'all' | 'notTagged' | 'tagged';

type TagStatusOption = {
  value: TagStatus;
  text: string;
}

const tagStatusOptions: TagStatusOption[] = [
  {value: 'all', text: '全て'},
  {value: 'notTagged', text: 'タグ無し'},
  {value: 'tagged', text: 'タグ付き'}
];

type Props = {
  tagStatus: TagStatus;
  searchWord: string;
  handleTagStatusChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSearchWordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  customStyles?: string;
}
const defaultStyle = '';

const ProductSearchHeader: FC<Props> = ({
    tagStatus,
    searchWord,
    handleTagStatusChange,
    handleSearchWordChange,
    handleSubmit,
    customStyles
  }) => {
  const styles = customStyles ? `${defaultStyle} ${customStyles}` : defaultStyle;
  return (
    <div className={styles}>
      <SelectBox
        inputValue={tagStatus}
        options={tagStatusOptions}
        handleChange={handleTagStatusChange}
        customStyles='w-full'
      />
      <div className='flex space-x-2'>
        <TextInput
          inputValue={searchWord}
          handleChange={handleSearchWordChange}
          customStyles='w-5/6'
        />
        <Button
          handleSubmit={handleSubmit}
          text="🔎"
          customStyles="bg-slate-500 rounded-md w-1/6 pt-2"
        />
      </div>
    </div>
  )
}

export default ProductSearchHeader;
