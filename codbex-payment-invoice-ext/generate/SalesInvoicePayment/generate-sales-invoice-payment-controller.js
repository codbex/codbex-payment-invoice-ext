const app = angular.module('templateApp', ['ideUI', 'ideView']);
app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    const salesInvoicesUrl = "/services/ts/codbex-payment-invoice-ext/generate/SalesInvoicePayment/api/GenerateSalesInvoicePaymentService.ts/salesInvoiceData/" + params.id;
    const customerPaymentUrl = "/services/ts/codbex-payment-invoice-ext/generate/SalesInvoicePayment/api/GenerateSalesInvoicePaymentService.ts/customerPayment/" + params.id;
    const salesInvoicePaymentUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoicePaymentService.ts/";

    $http.get(salesInvoicesUrl)
        .then(function (response) {
            $scope.SalesInvoices = response.data.salesInvoices;
        })
        .catch(function (error) {
            console.error("Error retrieving data:", error);
        });


    $http.get(customerPaymentUrl)
        .then(function (response) {
            $scope.CustomerPayment = response.data;
        })
        .catch(function (error) {
            console.error("Error retrieving data:", error);
        });


    $scope.generateSalesInvoicePayment = function () {
        const salesInvoices = $scope.SalesInvoices.filter(item => item.selected);

        salesInvoices.forEach((invoice) => {

            const salesInvoicePayment = {
                "SalesInvoice": invoice.Id,
                "CustomerPayment": $scope.CustomerPayment.Id,
                "Amount": $scope.CustomerPayment.Amount
            }

            $http.post(salesInvoicePaymentUrl, salesInvoicePayment)
                .then(function (response) {
                    $scope.closeDialog();
                }).catch(function (error) {
                    console.error("Error creating Sales Invoice Payment", error);
                    $scope.closeDialog();
                });
        });

    }

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("sales-invoice-payment-generate");
    };

    document.getElementById("dialog").style.display = "block";
}]);