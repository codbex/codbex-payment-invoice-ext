angular.module('templateApp', ['blimpKit', 'platformView']).controller('templateController', ($scope, $http, ViewParameters) => {
    const params = ViewParameters.get();
    const Dialogs = new DialogHub();

    const purchaseInvoicesUrl = "/services/ts/codbex-payment-invoice-ext/generate/PurchaseInvoicePayment/api/GeneratePurchaseInvoicePaymentService.ts/purchaseInvoiceData/" + params.id;
    const supplierPaymentUrl = "/services/ts/codbex-payment-invoice-ext/generate/PurchaseInvoicePayment/api/GeneratePurchaseInvoicePaymentService.ts/supplierPayment/" + params.id;
    const purchaseInvoicePaymentUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/purchaseinvoice/PurchaseInvoicePaymentService.ts/";

    $http.get(purchaseInvoicesUrl)
        .then(function (response) {
            $scope.PurchaseInvoices = response.data.purchaseInvoices;
        })
        .catch(function (error) {
            console.error("Error retrieving data:", error);
        });


    $http.get(supplierPaymentUrl)
        .then(function (response) {
            $scope.SupplierPayment = response.data;
        })
        .catch(function (error) {
            console.error("Error retrieving data:", error);
        });


    $scope.generatePurchaseInvoicePayment = function () {
        const purchaseInvoices = $scope.PurchaseInvoices.filter(item => item.selected);

        purchaseInvoices.forEach((invoice) => {

            const remainingPayment = invoice.Total - invoice.Paid;
            $scope.SupplierPayment.Amount = Math.min($scope.SupplierPayment.Amount, remainingPayment);

            const purchaseInvoicePayment = {
                "PurchaseInvoice": invoice.Id,
                "SupplierPayment": $scope.SupplierPayment.Id,
                "Amount": $scope.SupplierPayment.Amount
            }

            $http.post(purchaseInvoicePaymentUrl, purchaseInvoicePayment)
                .then(response => {
                    $scope.closeDialog();
                    console.log("Purchase Invoice Payment created successfully:", response.data);
                }).catch(error => {
                    Dialogs.showAlert({
                        title: 'Error creating debit note',
                        message: error.data.message,
                        type: AlertTypes.Error,
                        preformatted: true,
                    });
                    console.error('Error creating debit note:', error.data.message);
                    $scope.closeDialog();
                });
        });
    }

    $scope.closeDialog = () => {
        Dialogs.closeWindow({ path: viewData.path });
    };
});