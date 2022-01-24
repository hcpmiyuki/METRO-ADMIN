import { FC, useEffect, useState } from "react"
import { getAllProducts, getProductById, getProductsByIds } from '../../libs/product'
import { getTags, createTag, convertTagToOption } from '../../libs/tags'
import { insertProductTags, deleteProductTags } from '../../libs/productTags'
import ProductList from '../../components/model/product/productList'
import ProductSearchHeader from "../../components/model/product/ProductSearchHeader"
import TagAnnotationModal from "../../components/model/productTag/TagAnnotationModal"
import ModaShowButton from "../../components/model/productTag/TagAnnotationModalShowButton"
import Button from "../../components/ui/button"
import InfiniteScroll  from "react-infinite-scroller"

type TagStatus = 'all' | 'notTagged' | 'tagged';

type Props = {
  productsWithCheck: ProductWithCheck[];
  tagOptions: TagOption[];
};

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

const filterProductsByTagStatus = (products: ProductWithCheck[], tagStatus: TagStatus) => {
  const productsFilteredTemp = products.filter((product) => {
    const tagLength = !product.tags ? 0 : product.tags.length;
    if (tagStatus == 'tagged') {
      return tagLength != 0 
    } else if (tagStatus == 'notTagged') {
      return tagLength == 0
    } else {
      return true
    }
  });

  return productsFilteredTemp;
}

const filterProductsBySearchWord = (products: ProductWithCheck[], searchWord: string) => {
  const productsFilteredTemp = products.filter(
    product => product.product_name.includes(searchWord)
  );

  return productsFilteredTemp;
}

const ProductPage: FC<Props> = ({ productsWithCheck, tagOptions }) => {
  const [tagOptionsState, setTagOptionsState] = useState<TagOption[]>(tagOptions);
  const [tagOptionsCommon, setTagOptionsCommon] = useState<TagOption[]>([]);
  const [tagOptionsSelected, setTagOptionsSelected] = useState<readonly TagOption[]>([]);
  const [productsWithCheckState, setProductsWithCheckState] = useState<ProductWithCheck[]>(productsWithCheck);
  const [productsFilteredByTagStatus, setProductsFilteredByTagStatus] = useState<ProductWithCheck[]>(productsWithCheck);
  const [productsFilteredBySearchWord, setProductsFilteredBySearchWord] = useState<ProductWithCheck[]>(productsWithCheck);
  const [searchWord, setSearchWord] = useState<string>('');
  const [tagStatus, setTagStatus] = useState<TagStatus>('all');
  const [pageIndex, setpageIndex] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [modalShowed, setModalShowed] = useState<boolean>(false);
  const [productsChecked, setProductsChecked] = useState<ProductWithCheck[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const PAGE_PRODUCT_COUNT: number = 20;
  
  useEffect( () => {
    const productsFilteredByTagStatusTemp = filterProductsByTagStatus(productsWithCheckState, tagStatus);
    setProductsFilteredByTagStatus(productsFilteredByTagStatusTemp);

    const productsFilteredBySearchWordTemp = filterProductsBySearchWord(productsFilteredByTagStatusTemp, searchWord);
    setProductsFilteredBySearchWord(productsFilteredBySearchWordTemp);
  }, [productsWithCheckState])

  const updateProductsByIds = async(productIds: number[], reset:boolean=false) => {
    const productIdSet = new Set(productIds);
    const productsUpdated: ProductWithCheck[] = await Promise.all(productsWithCheckState.map(
      async (product) => {
        if (productIdSet.has(product.id)){
          const producUpdated: ProductWithCheck = await getProductById(product.id);
          producUpdated['checked'] = reset ? false : product.checked;
          return producUpdated;
        }
        product['checked'] = false;
        return product;
      }
    ));
    
    setProductsWithCheckState(productsUpdated);
  }
  
  //項目を読み込むときのコールバック
  const loadMore = () => {
    if (PAGE_PRODUCT_COUNT*pageIndex > productsFilteredByTagStatus.length) {
      setHasMore(false);
      return
    };
    setpageIndex(pageIndex+1);
  }

  const handleTagStatusChange = (tagStatusSelected: TagStatus) => {
    const productsFilteredTemp = filterProductsByTagStatus(productsWithCheckState, tagStatusSelected);
    setTagStatus(tagStatusSelected);
    setSearchWord('');
    setProductsFilteredByTagStatus(productsFilteredTemp);
    setProductsFilteredBySearchWord(productsFilteredTemp);
  }

  const handleSearchWordSubmit = () => {
    const productsFilteredTemp = filterProductsBySearchWord(productsFilteredByTagStatus, searchWord);
    setProductsFilteredBySearchWord(productsFilteredTemp);
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
    .then(async() => {
      const productIds = productsChecked.map(product => product.id);
      await updateProductsByIds(productIds, true)
      .then(() => {
        setModalShowed(false);
        setAllSelected(false);
        setTagOptionsSelected([]);
      })
      .catch((e) => {
        console.error(e);
      });
    })
    .catch((e) => {
      console.error(e);
    });
  }

  const handleTagCreate = async (tagName: string) => {
    if (tagName === '') return

    const tagCreated = await createTag(tagName);
    const tagOption = convertTagToOption(tagCreated);
    setTagOptionsSelected([...tagOptionsSelected, tagOption]);
    setTagOptionsState([...tagOptionsState, tagOption]);
  }

  const handleProductTagRelationDelete = async (tagId: number) => {
    await deleteProductTags(productsChecked, tagId)
    .then(async() => {
      const tagOptionsCommonTemp = tagOptionsCommon.filter(tag => !(tag.value === tagId));
      const productIds = productsChecked.map(product => product.id);
      await updateProductsByIds(productIds)
      setTagOptionsCommon(tagOptionsCommonTemp);
    })
    .catch((e) => {
      console.error(e);
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

  const selectAllToggle = () => {
    const productsFilteredBySearchWordTemp = productsFilteredBySearchWord.map((product) => {
      product['checked'] = !allSelected;
      return product;
    })
    setAllSelected(!allSelected);
    setProductsFilteredBySearchWord(productsFilteredBySearchWordTemp);
  }

  const loader = <div className="loader" key={0}>Loading ...</div>;

  return (
    <div>
      <ModaShowButton showModal={showModal} customStyles="z-20"/>
      {
        modalShowed &&
        <TagAnnotationModal
          closeModal={closeModal}
          productsChecked={productsChecked}
          tagOptions={tagOptionsState}
          tagOptionsSelected={tagOptionsSelected}
          tagOptionsCommon={tagOptionsCommon}
          handleAnnotate={handleProductTagRelationCreate}
          handleTagSelectChange={setTagOptionsSelected}
          handleTagCreate={handleTagCreate}
          handleProductTagRelationDelete={handleProductTagRelationDelete}
          customStyles='fixed top-32 mx-auto z-20'
        />
      }
      <ProductSearchHeader
        tagStatus={tagStatus}
        searchWord={searchWord}
        handleTagStatusChange={(event) => handleTagStatusChange(event.target.value as TagStatus)}
        handleSearchWordChange={(event) => setSearchWord(event.target.value)}
        handleSubmit={handleSearchWordSubmit}
        customStyles='fixed z-20 top-5 w-5/6'
      >
        <Button
          handleSubmit={selectAllToggle}
          text={allSelected ? '全選択解除' : '全選択'}
          customStyles="bg-slate-500 rounded-md w-2/6 p-1 text-sm"
        />
      </ProductSearchHeader>
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        loader={loader}
        className="mt-32"
      >
        <ProductList
          products={productsFilteredBySearchWord.slice(0, PAGE_PRODUCT_COUNT*pageIndex)}
          hadleCheckboxChange={hadleCheckboxChange}
        />
      </InfiniteScroll>
    </div>
  );
};

export async function getServerSideProps() {
  let productsWithCheck: ProductWithCheck[] = await getAllProducts();
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
