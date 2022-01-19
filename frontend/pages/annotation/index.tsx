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
  productsWithCheck: ProductWithCheck[];
  tagOptions: TagOption[];
};

const convertTagToOption = (tag:Tag): TagOption => {
  return {
    value: tag.id,
    label: tag.tag_name
  }
}

const extractTagsCommonToProducts = (products:Product[]): TagOption[] => {
  if (!products[0].tags) return [];

  // 論理積とる用
  let tagSetCommon:Set<number> = new Set(products[0].tags.map(tag=> tag.id));
  // 追加済みかメモする用
  let tagSetAdded:Set<number> = new Set([]);
  // 追加する用
  let tagsCommon:TagOption[] = [];

  // 選択されたproductsに共通するタグのidを調べる
  products.forEach(product => {
    const tagIds = !product.tags ? [] : product.tags.map(tag=> tag.id);
    tagSetCommon = new Set(tagIds.filter(x => tagSetCommon.has(x)));
  });

  // 条件に合うタグを追加していく
  products.forEach(product => {
    const tagsdCommonTemp = !product.tags ? [] : 
      product.tags.filter(tag => {
        if (tagSetCommon.has(tag.id) && !tagSetAdded.has(tag.id)){
          tagSetAdded.add(tag.id);
          return true;
        }
        return false;
      })
      .map(tag => convertTagToOption(tag));
      tagsCommon = [...tagsCommon, ...tagsdCommonTemp];
  });

  return tagsCommon;
}

const ProductPage: FC<Props> = ({ productsWithCheck, tagOptions }) => {
  const [tagOptionList, setTagOptionList] = useState<TagOption[]>(tagOptions);
  const [tagOptionsCommon, setTagOptionsCommon] = useState<TagOption[]>([]);
  const [tagOptionsSelected, setTagOptionsSelected] = useState<readonly TagOption[]>([]);
  const [productsFilteredByTagStatus, setProductsFilteredByTagStatus] = useState<ProductWithCheck[]>(productsWithCheck);
  const [productsFilteredBySearchWord, setProductsFilteredBySearchWord] = useState<ProductWithCheck[]>(productsWithCheck);
  const [searchWord, setSearchWord] = useState<string>('');
  const [tagStatus, setTagStatus] = useState<TagStatus>('all');
  const [pageIndex, setpageIndex] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [modalShowed, setModalShowed] = useState<boolean>(false);
  const [productsChecked, setProductsChecked] = useState<ProductWithCheck[]>([]);
  const PAGE_PRODUCT_COUNT: number = 20;
  const options: Option[] = [
    {value: 'all', text: '全て'},
    {value: 'notTagged', text: 'タグ無し'},
    {value: 'tagged', text: 'タグ付き'}
  ];

  useEffect( () => {
    const productsSearchedTemp = productsWithCheck.filter((product) => {
      const tagLength = !product.tags ? 0 : product.tags.length;
      if (tagStatus == 'tagged') {
        return tagLength != 0 
      } else if (tagStatus == 'notTagged') {
        return tagLength == 0
      } else {
        return true
      }
    });
    setSearchWord('');
    setProductsFilteredByTagStatus(productsSearchedTemp);
    setProductsFilteredBySearchWord(productsSearchedTemp);
  }, [tagStatus])

  //項目を読み込むときのコールバック
  const loadMore = () => {
    if (PAGE_PRODUCT_COUNT*pageIndex > productsFilteredByTagStatus.length) {
      setHasMore(false);
      return
    };
    setpageIndex(pageIndex+1);
  }

  const handleSearchWordSubmit = () => {
    const productsSearchedTemp = productsFilteredByTagStatus.filter(
      product => product.product_name.includes(searchWord)
    );
    setProductsFilteredBySearchWord(productsSearchedTemp);
  }

  const hadleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const productId = Number(event.target.value);
    const checked = event.target.checked;
    const productsFilteredBySearchWordTemp = productsFilteredBySearchWord.map((product) => {
      if (product.id == productId) {
        product.checked = checked;
      }
      return product;
    });
    setProductsFilteredBySearchWord(productsFilteredBySearchWordTemp);
  }

  const handleProductTagRelationCreate = async () => {
    await insertProductTags(productsChecked, tagOptionsSelected)
    .then(() => {
      Router.reload();
    })
    .catch((e) => {
      console.error(e)
    })
  }

  const handleTagCreate = async (tagName: string) => {
    if (tagName === '') return

    const tagCreated = await createTag(tagName);
    const tagOption = convertTagToOption(tagCreated);
    setTagOptionsSelected([...tagOptionsSelected, tagOption]);
    setTagOptionList([...tagOptionList, tagOption]);
  }

  const handleProductTagRelationDelete = async (value: any) => {
    await deleteProductTags(productsChecked, value)
    .then(() => {
      const tagOptionsCommonTemp = tagOptionsCommon.filter(tag => !(tag.value === value));
      setTagOptionsCommon(tagOptionsCommonTemp);
    })
    .catch((e) => {
      console.error(e)
    });
  }

  const showModal = () => {
    const productsCheckedTemp = productsFilteredBySearchWord.filter(product => product.checked);
    if (productsCheckedTemp.length === 0) {
      alert('チェックされた商品がありません');
      return;
    }
    setProductsChecked(productsCheckedTemp);

    const tagOptionsCommonTemp = extractTagsCommonToProducts(productsCheckedTemp);
    setTagOptionsCommon(tagOptionsCommonTemp);
    setModalShowed(true);
  }

  const closeModal = () => {
    setModalShowed(false);
    setTagOptionsSelected([]);
  }

  const loader = <div className="loader" key={0}>Loading ...</div>;

  return (
    <div>
      <EditButton showModal={showModal}/>
      {
        modalShowed &&
        <EditModal
          closeModal={closeModal}
          products={productsChecked}
          tagOptions={tagOptionList}
          tagsAnnotatedCommon={tagOptionsCommon}
          handleAnnotate={handleProductTagRelationCreate}
          handleTagSelectChange={setTagOptionsSelected}
          tagOptionsSelected={tagOptionsSelected}
          handleTagCreate={handleTagCreate}
          handleDeleteProductTagRelation={handleProductTagRelationDelete}
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
        <ProductList
          products={productsFilteredBySearchWord.slice(0, PAGE_PRODUCT_COUNT*pageIndex)}
          hadleCheckboxChange={hadleCheckboxChange}
        />
      </InfiniteScroll>
    </div>
  );
};

export async function getStaticProps() {
  let productsWithCheck: ProductWithCheck[] = await getProducts();
  productsWithCheck = productsWithCheck.map((product) => {
    product['checked'] = false
    return product;
  })

  const tags = await getTags();
  const tagOptions:TagOption[] = tags.map(tag => {
    return convertTagToOption(tag)
  });

  return {
    props: {
      productsWithCheck,
      tagOptions
    },
  }
}

export default ProductPage;
