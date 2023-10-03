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
  customer: string;
  created_at: string;
  scheduled_at: string;
  branch: string;
  amount: number;
  status: string;
};
