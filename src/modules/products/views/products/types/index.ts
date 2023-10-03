export type IProductPriceProps = {
  category: string;
  price: string;
};

export type IProductEntryProps = {
  category: string;
  quantity: number;
  calculated_price: string;
};

export type IProductData = {
  id: string;
  product_category: {
    id: number;
    name: string;
  };
  created_at: string;
  price_litre: number;
  sale_quantity: number;
  gross_price: number;
  publish: boolean;
};

export type IProductCategory = {
  id: number;
  name: string;
  icon: string;
};
