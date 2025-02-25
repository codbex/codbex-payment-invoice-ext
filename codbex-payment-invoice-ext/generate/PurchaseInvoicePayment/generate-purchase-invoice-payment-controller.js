const app = angular.module('templateApp', ['ideUI', 'ideView']);
app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

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
                .then(function (response) {
                    $scope.closeDialog();
                }).catch(function (error) {
                    console.error("Error creating Purchase Invoice Payment", error);
                    $scope.closeDialog();
                });
        });

    }

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("purchase-invoice-payment-generate");
    };

    document.getElementById("dialog").style.display = "block";
}]);