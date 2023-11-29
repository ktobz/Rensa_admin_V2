import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { OrdersView } from "@/modules/orders/views/OrdersView";
import { OrderDetails } from "@/modules/orders";
// import { PartnersView } from "@/modules/products/views/PartnersView";
import { SettlementsView } from "@/modules/settlements/views/SettlementsView";
import { DashboardView } from "@/modules/dashboard/views/DashboardView";
import CustomersView, {
  CustomerDetailsView,
  CustomerOrdersView,
} from "@/modules/branches";
// import { RidersView } from "@/modules/branch-manager/views/RidersView";
import { TransactionsView } from "@/modules/branches copy/views/TransactionsView";
import { CustomerTransactionsView } from "@/modules/branches/views/CustomerTransactionsView";
import { IncomeView } from "@/modules/orders copy/views/IncomeView";
// import { PartnerDetailsView } from "@/modules/products/views/PartnerDetailsView";
import NotificationCenterView from "@/modules/branch-manager copy";
import ConfigurationView from "@/modules/branch-manager copy 2";

// import { BranchDetailsView } from "@/modules/products/views/branches";
import { MarketPlaceListingsView } from "@/modules/settlements/views/MarketPlaceListingsView";
import { ScheduledOrdersView } from "@/modules/orders/views/ScheduledOrdersView";
import ReportedListingPageView from "@/modules/settlements copy";
import { ListingDetails } from "@/modules/settlements copy/views/ListingDetails";
import AppReleaseView from "@/modules/branch-manager copy 3";
import { AddListing } from "@/modules/settlements copy/views/AddListing";

export default function MergedModuleRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<DashboardView />} />
      <Route path="/orders" element={<OrdersView />} />
      <Route
        path="/orders/scheduled-orders"
        element={<ScheduledOrdersView />}
      />
      <Route
        path="/orders/scheduled-orders/:orderId"
        element={<OrderDetails />}
      />
      <Route path="/orders/:orderId" element={<OrderDetails />} />

      <Route path="/reported-listing" element={<ReportedListingPageView />} />
      <Route path="/reported-listing/:rp_id" element={<ListingDetails />} />

      <Route path="/marketplace" element={<SettlementsView />} />
      <Route
        path="/marketplace/listings"
        element={<MarketPlaceListingsView />}
      />
      <Route
        path="/marketplace/listings/add-listing"
        element={<AddListing />}
      />
      <Route path="/marketplace/listings/:rp_id" element={<ListingDetails />} />

      <Route path="/marketplace/:rp_id" element={<ListingDetails />} />

      <Route path="/transactions" element={<TransactionsView />} />
      <Route path="/sales-revenue" element={<IncomeView />} />
      <Route path="/users" element={<CustomersView />} />
      <Route path="/users/:c_id" element={<CustomerDetailsView />} />

      <Route path="/notification-center" element={<NotificationCenterView />} />
      <Route path="/app-release" element={<AppReleaseView />} />
      <Route path="/configurations" element={<ConfigurationView />} />

      <Route path="/customers/:id/orders" element={<CustomerOrdersView />} />
      <Route
        path="/customers/:c_id/transactions"
        element={<CustomerTransactionsView />}
      />
      <Route
        path="/customers/:c_id/orders/:orderId"
        element={<OrderDetails />}
      />

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
