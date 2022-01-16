import { FC, useEffect, useState } from "react"
import { getProducts } from '../../libs/product'
import { getTags, createTag } from '../../libs/tags'
import { insertProductTags, deleteProductTags } from '../../libs/productTags'
import ProductList from '../../components/productList'
import KeywordSearch from "../../components/keywordSearch"
import EditButton from "../../components/editButton"
import EditModal from "../../components/editModal"
import InfiniteScroll  from "react-infinite-scroller"
import Router from 'next/router'

type TagStatus = 'all' | 'notTagged' | 'tagged';

type Option = {
  value: TagStatus;
  text: string;
}

type Props = {
  products: ProductWithCheck[];
  tagOptions: TagOption[];
};

const tagToOption = (tag:Tag): TagOption => {
  return {
    value: tag.id,
    label: tag.tag_name
  }
}

const filterCommonTags = (products:Product[]): TagOption[] => {
  // 論理積とる用
  let tagCommon:Set<number> = new Set(products[0].tags.map(tag=> tag.id));
  // 追加済みかメモする用
  let tagAdded:Set<number> = new Set([]);
  // 追加する用
  let tagsAnnotatedCommonTemps:TagOption[] = [];

  // 選択されたproductに共通するタグのidを調べる
  products.slice(1,).forEach(product => {
    const tagIds = product.tags.map(tag=> tag.id);
    tagCommon = new Set(tagIds.filter(x => tagCommon.has(x)));
  });

  // 条件に合うタグを追加していく
  products.forEach(product => {
    const tagsAnnotatedCommonTemp = product.tags
      .filter(tag => {
        if (tagCommon.has(tag.id) && !tagAdded.has(tag.id)){
          tagAdded.add(tag.id);
          return true;
        }
        return false;
      })
      .map(tag => tagToOption(tag));
    tagsAnnotatedCommonTemps = [...tagsAnnotatedCommonTemps, ...tagsAnnotatedCommonTemp]
  });

  return tagsAnnotatedCommonTemps;
}

const ProductPage: FC<Props> = ({ products, tagOptions }) => {
  const [tagOptionList, setTagOptionList] = useState<TagOption[]>(tagOptions);
  const [tagsAnnotatedCommon, setTagsAnnotatedCommon] = useState<TagOption[]>([]);
  const [tagOptionsSelected, setTagOptionsSelected] = useState<readonly TagOption[]>([]);
  const [productsSearched, setProductsSearched] = useState<ProductWithCheck[]>(products);
  const [productsSearchedSelected, setproductsSearchedSelected] = useState<ProductWithCheck[]>(products);
  const [searchWord, setSearchWord] = useState<string>('');
  const [tagStatus, setTagStatus] = useState<TagStatus>('all');
  const [pageNum, setPageNum] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showModalFlag, setShowModalFlag] = useState<boolean>(false);
  const [productsChecked, setProductsChecked] = useState<ProductWithCheck[]>([]);
  const PAGE_PRODUCT_COUNT: number = 20;
  const options: Option[] = [
    {value: 'all', text: '全て'},
    {value: 'notTagged', text: 'タグ無し'},
    {value: 'tagged', text: 'タグ付き'}
  ];

  useEffect( () => {
    const productsSearchedTemp = products.filter((product) => {
      const tagLength = product.tags.length;
      if (tagStatus == 'tagged') {
        return tagLength != 0 
      } else if (tagStatus == 'notTagged') {
        return tagLength == 0
      } else {
        return true
      }
    });
    setSearchWord('');
    setProductsSearched(productsSearchedTemp);
    setproductsSearchedSelected(productsSearchedTemp);
  }, [tagStatus])

    //項目を読み込むときのコールバック
  const loadMore = () => {
    if (PAGE_PRODUCT_COUNT*pageNum > productsSearched.length) {
      setHasMore(false);
      return
    };
    setPageNum(pageNum+1);
  }

  const handleSearchWordSubmit = (event: any) => {
    const productsSearchedTemp = productsSearched.filter(product => product.product_name.includes(searchWord));
    setproductsSearchedSelected(productsSearchedTemp);
  }

  const hadleCheckboxChange = (event: any) => {
    const id:number = event.target.value;
    const isChecked:boolean = event.target.checked;
    const productsSearchedSelectedTemp = productsSearchedSelected.map((product) => {
      if (product.id == id) {
        product.isChecked = isChecked
      }
      return product
    });
    setproductsSearchedSelected(productsSearchedSelectedTemp);
  }

  const handleTagAnnotate = async () => {
    await insertProductTags(productsChecked, tagOptionsSelected)
    .then(() => {
      Router.reload();
    })
    .catch((e) => {
      console.error(e)
    })
  }

  const handleTagCreate = async (inputValue: string) => {
    if (inputValue === '') return

    const tagCreated = await createTag(inputValue);
    const tagOption = tagToOption(tagCreated);
    setTagOptionsSelected([...tagOptionsSelected, tagOption]);
    setTagOptionList([...tagOptionList, tagOption]);
  }

  const handleDeleteProductTagRelation = async (value: any) => {
    await deleteProductTags(productsChecked, value)
    .then(() => {
      const tagsAnnotatedCommonTemp = tagsAnnotatedCommon.filter(tag => !(tag.value === value));
      setTagsAnnotatedCommon(tagsAnnotatedCommonTemp);
    })
    .catch((e) => {
      console.error(e)
    });
  }

  const showModal = () => {
    const productsSearchedSelectedTemp = productsSearchedSelected.filter(product => product.isChecked);
    if (productsSearchedSelectedTemp.length === 0) {
      alert('チェックされた商品がありません');
      return;
    }
    setProductsChecked(productsSearchedSelectedTemp);

    const commonTags = filterCommonTags(productsSearchedSelectedTemp);
    setTagsAnnotatedCommon(commonTags);
    setShowModalFlag(true);
  }

  const closeModal = () => {
    setShowModalFlag(false);
    setTagOptionsSelected([]);
  }

  const productsLoaded = (
    <ProductList products={productsSearchedSelected.slice(0, PAGE_PRODUCT_COUNT*pageNum)} hadleCheckboxChange={hadleCheckboxChange} />
  );

  const loader =<div className="loader" key={0}>Loading ...</div>;

  return (
    <div>
      <EditButton showModal={showModal}/>
      {
        showModalFlag &&
        <EditModal
          closeModal={closeModal}
          products={productsChecked}
          tagOptions={tagOptionList}
          tagsAnnotatedCommon={tagsAnnotatedCommon}
          handleAnnotate={handleTagAnnotate}
          handleTagSelectChange={setTagOptionsSelected}
          tagOptionsSelected={tagOptionsSelected}
          handleTagCreate={handleTagCreate}
          handleDeleteProductTagRelation={handleDeleteProductTagRelation}
        />
      }
      <div className="fixed z-20 w-5/6">
        <select value={tagStatus} className="rounded w-full" onChange={(event) => setTagStatus(event.target.value as TagStatus)}>
          {options.map((option, i) => {
            return <option value={option.value} key={i}>{option.text}</option>
          })}
        </select>
        <KeywordSearch
          handleChange={setSearchWord}
          handleSubmit={handleSearchWordSubmit}
          searchWord={searchWord}
        />
      </div>
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        loader={loader}
        className="relative	top-600"
      >
        {productsLoaded}
      </InfiniteScroll>
    </div>
  );
};

export async function getStaticProps() {
  let products: ProductWithCheck[] = await getProducts();
  products = products.map((item) => {
    item['isChecked'] = false
    return item
  })

  const tags = await getTags();
  const tagOptions:TagOption[] = tags.map(tag => {
    return tagToOption(tag)
  });

  return {
    props: {
      products,
      tagOptions
    },
  }
}

export default ProductPage;