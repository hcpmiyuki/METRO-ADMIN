import { FC } from 'react'
import SliderItem from '../product/ProductSlider'
import CreatableSelect from 'react-select/creatable';
import Button from '../../ui/button';
import Tag from '../tag/tag';
import { convertTagOptionToTag } from '../../../libs/tags'

type Props = {
  closeModal: () => void;
  productsChecked: Product[];
  tagOptions: TagOption[];
  tagOptionsSelected: readonly TagOption[];
  tagOptionsCommon: TagOption[];
  handleAnnotate: () => void;
  handleTagSelectChange: (inputValue: readonly TagOption[]) => void;
  handleTagCreate: (inputValue: string) => void;
  handleProductTagRelationDelete: (value: number) => void;
  customStyles?: string;
};

const defaultStyle = 'w-5/6 bg-white p-5 border border-gray-600 border-solid rounded-lg';

const TagAnnotationModal: FC<Props> = ({
    closeModal,
    productsChecked,
    tagOptions,
    tagOptionsSelected,
    tagOptionsCommon,
    handleAnnotate,
    handleTagSelectChange,
    handleTagCreate,
    handleProductTagRelationDelete,
    customStyles
  }) => {
  const styles = customStyles ? `${defaultStyle} ${customStyles}` : defaultStyle;
  return (
    <div className={styles}>
      <SliderItem products={productsChecked}/>
      <div>
        <p>共通のタグ</p>
        <div className='space-x-1'>
          {tagOptionsCommon.length === 0 ?'なし' :
            tagOptionsCommon.map((tagOption) => {
              const tag = convertTagOptionToTag(tagOption);
              return (
                <Tag key={tag.id} tagName={tag.tag_name} customStyles='text-lg'>
                  <span className='px-1.5' onClick={() => handleProductTagRelationDelete(tag.id)}>×</span>
                </Tag>
              )
            })
          }
        </div>
      </div>
      <CreatableSelect
        isClearable
        isMulti
        onChange={(e) => handleTagSelectChange(e)}
        onCreateOption={handleTagCreate}
        options={tagOptions}
        value={tagOptionsSelected}
      />
      <Button
        handleSubmit={handleAnnotate}
        text="タグ付け"
        customStyles="bg-slate-500 rounded-md w-1/4 text-sm p-2 mx-auto"
      />
      <p className="w-8 h-8 text-center text-2xl absolute top-0.5 right-0.5" onClick={closeModal}>×</p>
    </div>
  )
}

export default TagAnnotationModal;