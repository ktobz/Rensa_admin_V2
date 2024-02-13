import { Routes, Route, Navigate } from "react-router-dom";

import { OrdersView } from "@/modules/orders/views/OrdersView";
import { OrderDetails } from "@/modules/orders";
import { SettlementsView } from "@/modules/settlements/views/SettlementsView";
import { DashboardView } from "@/modules/dashboard/views/DashboardView";
import { MarketPlaceListingsView } from "@/modules/settlements/views/MarketPlaceListingsView";
import { ScheduledOrdersView } from "@/modules/orders/views/ScheduledOrdersView";
import ReportedListingPageView from "@/modules/marketplace";
import { ListingDetails } from "@/modules/marketplace/views/ListingDetails";
import { AddListing } from "@/modules/marketplace/views/AddListing";
import TransactionsView from "@/modules/transaction";
import { PayoutView } from "@/modules/transaction/views/PayoutView";
import IncomeView from "@/modules/income";
import NotificationCenterView from "@/modules/notification-center";
import AppReleaseView from "@/modules/app-release";
import ConfigurationView from "@/modules/configuration";
import CustomersView, { CustomerDetailsView } from "@/modules/users";
import { CustomerTransactionsView } from "@/modules/users/views/CustomerTransactionsView";

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
      <Route path="/payouts" element={<PayoutView />} />
      <Route path="/sales-revenue" element={<IncomeView />} />

      <Route path="/notification-center" element={<NotificationCenterView />} />
      <Route path="/app-release" element={<AppReleaseView />} />
      <Route path="/configurations" element={<ConfigurationView />} />

      <Route path="/users" element={<CustomersView />} />
      <Route path="/users/:c_id" element={<CustomerDetailsView />} />
      <Route path="/users/:c_id/:rp_id" element={<ListingDetails />} />
      <Route path="/users/:c_id/:orderId" element={<OrderDetails />} />

      <Route
        path="/users/:c_id/transactions"
        element={<CustomerTransactionsView />}
      />
      <Route path="/users/:c_id/orders/:orderId" element={<OrderDetails />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
