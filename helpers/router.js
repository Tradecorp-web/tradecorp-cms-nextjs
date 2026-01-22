export default function getRoute(name, query) {
  var path = routerList?.find((i) => i.name == name)?.path;
  for (var key in query) {
    if (query.hasOwnProperty(key)) {
      path = path?.replace(":" + key, query[key]);
    }
  }
  return path;
}

export const routerList = [
  { name: "home", path: "/" },
  { name: "auth.login", path: "/login" },
  { name: "auth.forgot.password", path: "/forgot-password" },

  { name: "profile", path: "/profile" },
  { name: "profile.edit.profile", path: "/profile/edit-profile" },
  { name: "profile.edit.password", path: "/profile/edit-password" },

  { name: "container", path: "/container" },
  { name: "container.price.generator", path: "/container/price-generator" },
  { name: "container.detail", path: "/container/:id" },

  { name: "lease.agreement", path: "/container/lease-agreement" },
  { name: "lease.agreement.detail", path: "/container/lease-agreement/:id" },

  { name: "container.lease", path: "/container/lease" },

  { name: "one.way", path: "/container/one-way" },
  { name: "one.way.detail", path: "/container/one-way/:id" },

  { name: "company.directory", path: "/company-directory" },
  { name: "company.directory.detail", path: "/company-directory/:companyId" },
  {
    name: "company.directory.users",
    path: "/company-directory/:companyId/users",
  },

  { name: "mail.group", path: "/company-directory/:companyId/mail-group" },
  {
    name: "mail.group.detail",
    path: "/company-directory/:companyId/mail-group/:id",
  },

  { name: "customer", path: "/customer" },
  { name: "customer.detail", path: "/customer/:id" },
  {
    name: "customer.customer-company-search-form",
    path: "/customer/customer-company-search-form",
  },
  { name: "customer.customer-input", path: "/customer/customer-input" },
  { name: "customer.customer-page", path: "/customer/customer-page" },
  { name: "customer.customer-edit", path: "/customer/:id" },
  {
    name: "customer.customer-company-search-form",
    path: "/customer/customer-company-search-form",
  },

  { name: "customer-reference.list", path: "/customer-reference" },
  { name: "customer-reference.detail", path: "/customer-reference/:id" },

  { name: "depo.group", path: "/depo/group" },
  { name: "depo.schedular", path: "/depo/schedular" },
  { name: "depo", path: "/depo/:depoSlug" },
  { name: "depo.create", path: "/depo/create" },
  { name: "depo.detail", path: "/depo/:depoSlug/detail" },
  { name: "depo.partner", path: "/depo/:depoSlug/depot-partner" },
  { name: "depo.stock", path: "/depo/:depoSlug/stock" },
  { name: "depo.stock.create", path: "/depo/:depoSlug/stock/create" },
  { name: "depo.stock.import", path: "/depo/:depoSlug/stock/import" },
  { name: "depo.stock.detail", path: "/depo/:depoSlug/stock/:id" },
  { name: "depo.do.accept", path: "/depo/:depoSlug/do-acceptance" },
  {
    name: "depo.do.accept.create",
    path: "/depo/:depoSlug/do-acceptance/create",
  },
  { name: "depo.do.accept.detail", path: "/depo/:depoSlug/do-acceptance/:id" },
  { name: "depo.do.release", path: "/depo/:depoSlug/do-release" },
  { name: "depo.do.release.create", path: "/depo/:depoSlug/do-release/create" },
  { name: "depo.do.release.detail", path: "/depo/:depoSlug/do-release/:id" },
  { name: "depo.eir.in", path: "/depo/:depoSlug/eir-in" },
  { name: "depo.eir.in.create", path: "/depo/:depoSlug/eir-in/create" },
  { name: "depo.eir.in.detail", path: "/depo/:depoSlug/eir-in/:eirNo" },
  { name: "depo.eir.out", path: "/depo/:depoSlug/eir-out" },
  { name: "depo.eir.out.create", path: "/depo/:depoSlug/eir-out/create" },
  { name: "depo.eir.out.detail", path: "/depo/:depoSlug/eir-out/:eirNo" },
  { name: "depo.settings", path: "/depo/:depoSlug/settings" },
  {
    name: "depo.settings.operation",
    path: "/depo/:depoSlug/settings/operation-officer",
  },
  { name: "depo.settings.layout", path: "/depo/:depoSlug/settings/layout" },

  { name: "3d", path: "/3d" },
  { name: "3d.design", path: "/3d/design/:id" },

  { name: "quote", path: "/quote" },
  { name: "quote.approval", path: "/quote/approval" },

  { name: "quotein", path: "/quotein" },
  { name: "quotein-build-quote", path: "/quotein/build-quote/:id" },

  { name: "general-build", path: "/general-build" },

  { name: "quotein-production", path: "/quotein-production" },
  {
    name: "order-production",
    path: "/quotein-production/:id",
  },
  { name: "quotein-completed", path: "/quotein-completed" },
  {
    name: "order-completed",
    path: "/quotein-completed/:id",
  },

  { name: "product", path: "/material/product" },
  { name: "product.detail", path: "/material/product/:id" },
  { name: "product.edit", path: "/material/product/:id/edit" },
  { name: "product.category", path: "/material/product/category" },

  { name: "material", path: "/material" },
  { name: "material.detail", path: "/material/:id" },
  { name: "material.edit", path: "/material/:id/edit" },
  { name: "material.category", path: "/material/category" },

  { name: "vendor", path: "/material/vendor" },
  { name: "vendor.create", path: "/material/vendor/create" },
  { name: "vendor.detail", path: "/material/vendor/:id" },
  { name: "vendor.edit", path: "/material/vendor/:id/edit" },

  { name: "po", path: "/po" },
  { name: "po.detail", path: "/po/:id" },
  { name: "po.request.wo", path: "/po/wo" },
  { name: "po.po-history", path: "/po/po-history" },
  { name: "po.request.wo.detail", path: "/po/wo/:id" },

  { name: "wo", path: "/wo" },
  { name: "wo-history", path: "/wo/wo-history" },

  { name: "warehouse", path: "/warehouse" },
  { name: "warehouse.list", path: "/warehouse/list" },
  { name: "warehouse.stock", path: "/warehouse/stock" },
  { name: "warehouse.material.in", path: "/warehouse/material-in" },
  { name: "warehouse.material.in.detail", path: "/warehouse/material-in/:id" },
  { name: "warehouse.material.out", path: "/warehouse/material-out" },
  {
    name: "warehouse.material.out.detail",
    path: "/warehouse/material-out/:id",
  },

  { name: "vehicle", path: "/vehicle" },
  { name: "vehicle.detail", path: "/vehicle/:id" },
  { name: "vehicle.edit", path: "/vehicle/:id/edit" },
  { name: "vehicle.category", path: "/vehicle/category" },
  { name: "vehicle.checklist", path: "/vehicle/checklist" },

  { name: "driver", path: "/driver" },
  { name: "driver.detail", path: "/driver/:id" },
  { name: "driver.edit", path: "/driver/:id/edit" },
  { name: "driver.map", path: "/driver/map" },
  { name: "driver.job", path: "/driver/job" },
  { name: "driver.job.detail", path: "/driver/job/:id" },

  { name: "document", path: "/document" },
  { name: "document.folder", path: "/document/:id" },
  { name: "document.browse", path: "/document/browse" },
  { name: "document.browse.folder", path: "/document/browse/:id" },

  { name: "files", path: "/files" },
  { name: "files.folder", path: "/files/:id" },
  { name: "files.trash", path: "/files/trash" },

  { name: "pwdman", path: "/pwdman" },

  { name: "task", path: "/task" },

  //acounting path
  { name: "accounting", path: "/accounting" },
  { name: "accounting.master.coa", path: "/accounting/master/coa" },

  { name: "accounting", path: "/accounting/master" },
  { name: "accounting.master", path: "/accounting/master" },

  {
    name: "accounting.master.bankaccount",
    path: "/accounting/master/bank-account",
  },
  {
    name: "accounting.master.assets",
    path: "/accounting/master/assets",
  },
  { name: "accounting.master.customer", path: "/accounting/master/customer" },
  { name: "accounting.master.supplier", path: "/accounting/master/supplier" },

  { name: "accounting.master.team", path: "/accounting/master/team" },
  { name: "accounting.master.warehouse", path: "/accounting/master/warehouse" },

  { name: "accounting.master.office", path: "/accounting/master/office" },

  //transaction

  {
    name: "accounting.transaction",
    path: "/accounting/transaction",
  },
  // {
  //   name: "accounting.transaction-landing",
  //   path: "/accounting/transaction/transaction-landing",
  // },

  {
    name: "accounting.transaction.journal",
    path: "/accounting/transaction/journal",
  },
  {
    name: "accounting.transaction.journal-form",
    path: "/accounting/transaction/journal/journal-form",
  },
  {
    name: "accounting.transaction.journal-list",
    path: "/accounting/transaction/journal/journal-list",
  },
  {
    name: "accounting.transaction.journal-list",
    path: "/accounting/transaction/journal/journal-list",
  },
  {
    name: "accounting.transaction.general-ledger",
    path: "/accounting/transaction/journal/general-ledger",
  },

  {
    name: "accounting.transaction.import",
    path: "/accounting/transaction/import",
  },
  {
    name: "accounting.transaction.import.ref-data",
    path: "/accounting/transaction/import/:srcId",
    // path: "/accounting/transaction/import/ref-data/:srcId",
  },

  {
    name: "accounting.transaction.adjustment",
    path: "/accounting/transaction/adjustment",
  },
  {
    name: "accounting.transaction.purchase",
    path: "/accounting/transaction/purchase",
  },
  {
    name: "accounting.transaction.purchase.vendor",
    path: "/accounting/transaction/purchase/vendor",
  },
  {
    name: "accounting.transaction.purchase.po",
    path: "/accounting/transaction/purchase/po",
  },

  {
    name: "accounting.transaction.purchase.po.detail",
    path: "/accounting/transaction/purchase/po/:id",
  },

  {
    name: "accounting.transaction.purchase.material",
    path: "/accounting/transaction/purchase/material",
  },

  //acc trx sales
  {
    name: "accounting.transaction.sales",
    path: "/accounting/transaction/sales",
  },

  {
    name: "accounting.transaction.sales.sales_customer",
    path: "/accounting/transaction/sales/sales_customer",
  },
  {
    name: "accounting.transaction.sales.sales_invoice",
    path: "/accounting/transaction/sales/sales_invoice",
  },

  {
    name: "accounting.transaction.sales.sales_order_approve",
    path: "/accounting/transaction/sales/sales-order-approve",
  },
  {
    name: "accounting.transaction.sales.sales_order_approve_project",
    path: "/accounting/transaction/sales/sales-order-approve/:projectcode",
  },
  //== acc trx sales
  {
    name: "accounting.transaction.expenses",
    path: "/accounting/transaction/expenses",
  },

  {
    name: "accounting.transaction.cashinbank",
    path: "/accounting/transaction/cash-in-bank",
  },

  {
    name: "accounting.transaction.pettycash",
    path: "/accounting/transaction/petty-cash",
  },
  {
    name: "accounting.transaction.assetsdepreciation",
    path: "/accounting/transaction/assets-depreciation",
  },
  {
    name: "accounting.transaction.amortization",
    path: "/accounting/transaction/amortization",
  },
  //==transaction
  {
    name: "accounting.report",
    path: "/accounting/report",
  },
  {
    name: "accounting.report.cashflow",
    path: "/accounting/report/cash-flow",
  },
  {
    name: "accounting.report.generalledger",
    path: "/accounting/report/general-ledger",
  },

  {
    name: "accounting.report.trialbalance",
    path: "/accounting/report/trial-balance",
  },
  {
    name: "accounting.report.balancesheet",
    path: "/accounting/report/balance-sheet",
  },

  {
    name: "accounting.report.profitandloss",
    path: "/accounting/report/profit-and-loss",
  },

  //Setting
  {
    name: "accounting.setting",
    path: "/accounting/setting",
  },
  {
    name: "accounting.setting.acc-mapping",
    path: "/accounting/setting/acc-mapping",
  },

  {
    name: "accounting.setting.acc-bank",
    path: "/accounting/setting/acc-bank",
  },
  {
    name: "accounting.setting.acc-payment-setup",
    path: "/accounting/setting/acc-payment-setup",
  },
  {
    name: "accounting.setting.acc-payment-setup.input",
    path: "/accounting/setting/acc-payment-setup/input",
  },
  {
    name: "accounting.setting.acc-payment-setup.edit",
    path: "/accounting/setting/acc-payment-setup/edit",
  },

  {
    name: "accounting.setting.acc-bank-statement-setup",
    path: "/accounting/setting/acc-bank-statement-setup",
  },
  {
    name: "accounting.setting.acc-bank-statement-setup.input",
    path: "/accounting/setting/acc-bank-statement-setup/input",
  },
  {
    name: "accounting.setting.acc-bank-statement-setup.edit",
    path: "/accounting/setting/acc-bank-statement-setup/edit",
  },

  //payment term
  {
    name: "accounting.setting.acc-payment-term",
    path: "/accounting/setting/acc-payment-term",
  },
  {
    name: "accounting.setting.acc-payment-term.input",
    path: "/accounting/setting/acc-payment-term/input",
  },
  {
    name: "accounting.setting.acc-payment-term.edit",
    path: "/accounting/setting/acc-payment-term/edit",
  },
  //===payment term
  //== Setting

  //==acounting path

  // ------------------------
  // Admin Router
  // ------------------------
  { name: "admin", path: "/admin" },
  { name: "admin.dashboard", path: "/admin/dashboard" },
  { name: "admin.company", path: "/admin/company" },
  { name: "admin.company.office", path: "/admin/company/office" },
  { name: "admin.company.office.add", path: "/admin/company/office/add" },
  {
    name: "admin.company.office.edit",
    path: "/admin/company/office/edit/:officeId",
  },
  { name: "admin.company.depo", path: "/admin/company/depo" },
  { name: "admin.company.depo.add", path: "/admin/company/depo/add" },
  { name: "admin.company.depo.edit", path: "/admin/company/depo/edit/:depoId" },
  { name: "admin.company.depo.detail", path: "/admin/company/depo/:depoId" },
  { name: "admin.company.warehouse", path: "/admin/company/warehouse" },
  { name: "admin.company.warehouse.add", path: "/admin/company/warehouse/add" },
  {
    name: "admin.company.warehouse.edit",
    path: "/admin/company/warehouse/edit/:warehouseId",
  },
  {
    name: "admin.company.warehouse.detail",
    path: "/admin/company/warehouse/:warehouseId",
  },
  { name: "admin.setting", path: "/admin/settings" },
  { name: "admin.setting.config", path: "/admin/settings/config" },
  { name: "admin.setting.device", path: "/admin/settings/device" },
  { name: "admin.user.list", path: "/admin/user" },

  { name: "admin.master.data.list", path: "/admin/master/data" },
  { name: "admin.master.color", path: "/admin/master/color" },
  { name: "admin.permission.template", path: "/admin/permission/template" },

  { name: "admin.position", path: "/admin/position" },
  { name: "admin.team", path: "/admin/team" },

  { name: "admin.flowmaster", path: "/admin/flowmaster" },
  { name: "admin.fmpo", path: "/admin/flowmaster/flowlistmod/purchase_order" },
  { name: "admin.fmwo", path: "/admin/flowmaster/flowlistmod/wo" },

  { name: "admin.master.project", path: "/admin/master/master_project" },
  { name: "admin.fmpo", path: "/admin/flowmaster/flowlistmod/purchase_order" },
  { name: "admin.fmwo", path: "/admin/flowmaster/flowlistmod/wo" },
  { name: "admin.fminvoice", path: "/admin/flowmaster/flowlistmod/invoicing" },

  { name: "admin.company_type", path: "/admin/company_type" },
  // { name: "admin.fmwo", path: "/admin/flowmaster/form/:modul" },

  //{ name: "admin.folder",                     path: "/admin/folder" },

  //sales
  { name: "sales", path: "/sales" },
  { name: "sales-order-edit", path: "/sales/:projectcode" },
  { name: "sales.sales-order-input", path: "/sales/sales-order-input" },
  {
    name: "sales.sales-order-edit-detail",
    path: "/sales/edit-list/:projectCode",
  },
  { name: "sales.sales-order-inputwo", path: "/sales/sales-order-inputwo" },
  { name: "sales.sales-order-ongoing", path: "/sales/sales-order-ongoing" },
  { name: "sales.sales-order-history", path: "/sales/sales-order-history" },

  { name: "deal_builder", path: "/deal-builder" },

  { name: "invoice", path: "/invoice" },
  { name: "invoice.form", path: "/invoice/form" },
  { name: "invoice.customer", path: "/invoice/customer-invoice" },
  { name: "invoice.search-sales-order", path: "/invoice/search-sales-order" },
  { name: "invoice.search-payment-term", path: "/invoice/search-payment-term" },

  { name: "payment", path: "/payment" },
  { name: "payment-input", path: "/payment/input" },
  { name: "payment-edit", path: "/payment/edit" },
  { name: "payment-transaction", path: "/payment/payment-transaction" },
  { name: "bank-statement-import", path: "/payment/bank-statement-import" },
  { name: "payment-compare", path: "/payment/compare/payment-compare" },
  { name: "payment-history", path: "/payment/history/payment-history" },
  { name: "payment-control", path: "/payment/control/payment-control" },

  //master
  { name: "master.serial_number", path: "/master/serial_number" },
  {
    name: "master.serial_number.prefix",
    path: "/master/serial_number/:prefix",
  },
  //==master
];
