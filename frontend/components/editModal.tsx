import { FC } from 'react'
import SliderItem from './slider'
import CreatableSelect from 'react-select/creatable';
import Button from './button'
import TagWithDelete from './tagDelete'

type Props = {
  closeModal: () => void;
  products: Product[];
  tagOptions: TagOption[];
  tagOptionsSelected: readonly TagOption[];
  tagsAnnotatedCommon: TagOption[];
  handleAnnotate: () => void;
  handleTagSelectChange: (inputValue: readonly TagOption[]) => void;
  handleTagCreate: (inputValue: string) => void;
  handleDeleteProductTagRelation: (value: any) => void;
};

const EditModal: FC<Props> = ({closeModal, products, tagOptions, tagOptionsSelected, tagsAnnotatedCommon, handleAnnotate, handleTagSelectChange, handleTagCreate, handleDeleteProductTagRelation }) => {
  return (
    <div className="w-5/6 bg-lime-300 fixed top-20 mx-auto z-10">
      <SliderItem products={products}/>
      <div>
        <p>共通のタグ</p>
        <div className='space-x-1'>
          {tagsAnnotatedCommon.length === 0 ?
            'なし' :
            tagsAnnotatedCommon.map((tagOption) => {
              const tag: Tag = {
                id: tagOption.value,
                tag_name: tagOption.label
              }
              return (
                <TagWithDelete
                  key={tag.id}
                  tag={tag}
                  handleClick={handleDeleteProductTagRelation}
                />
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
        styles="bg-slate-500 rounded-md w-1/6"
        label="タグ付け"
      />
      <p className="w-8 h-8 text-center text-2xl absolute top-0.5 right-0.5" onClick={closeModal}>×</p>
    </div>
  )
}

export default EditModal;