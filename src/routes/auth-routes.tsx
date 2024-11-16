import { Navigate, Route, Routes } from "react-router-dom";

import AppReleaseView from "@/modules/app-release";
import ConfigurationView from "@/modules/configuration";
import { DashboardView } from "@/modules/dashboard/views/DashboardView";
import IncomeView from "@/modules/income";
import ReportedListingPageView from "@/modules/marketplace";
import { AddListing } from "@/modules/marketplace/views/AddListing";
import { ListingDetails } from "@/modules/marketplace/views/ListingDetails";
import NotificationCenterView from "@/modules/notification-center";
import { OrderDetails } from "@/modules/orders";
import { OrdersView } from "@/modules/orders/views/OrdersView";
import { ScheduledOrdersView } from "@/modules/orders/views/ScheduledOrdersView";
import OtpLogView from "@/modules/otp-log";
import { MarketPlaceListingsView } from "@/modules/settlements/views/MarketPlaceListingsView";
import { SettlementsView } from "@/modules/settlements/views/SettlementsView";
import TransactionsView from "@/modules/transaction";
import { PayoutView } from "@/modules/transaction/views/PayoutView";
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

      <Route path="/otp-log" element={<OtpLogView />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
