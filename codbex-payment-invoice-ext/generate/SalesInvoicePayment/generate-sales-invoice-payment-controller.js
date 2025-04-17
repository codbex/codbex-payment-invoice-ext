angular.module('templateApp', ['blimpKit', 'platformView']).controller('templateController', ($scope, $http, ViewParameters) => {
    const params = ViewParameters.get();
    const Dialogs = new DialogHub();

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


    $scope.generateSalesInvoicePayment = () => {
        const salesInvoices = $scope.SalesInvoices.filter(item => item.selected);

        salesInvoices.forEach((invoice) => {

            const remainingPayment = invoice.Total - invoice.Paid;
            $scope.CustomerPayment.Amount = Math.min($scope.CustomerPayment.Amount, remainingPayment);

            const salesInvoicePayment = {
                "SalesInvoice": invoice.Id,
                "CustomerPayment": $scope.CustomerPayment.Id,
                "Amount": $scope.CustomerPayment.Amount
            }

            $http.post(salesInvoicePaymentUrl, salesInvoicePayment)
                .then(response => {
                    $scope.closeDialog();
                    console.log("Sales Invoice Payment created successfully:", response.data);
                }).catch(error => {
                    Dialogs.showAlert({
                        title: 'Error creating debit note',
                        message: error.data.message,
                        type: AlertTypes.Error,
                        preformatted: true,
                    });
                    console.error('Error creating Sales Invoice Payment', error.data.message);
                    $scope.closeDialog();
                });
        });

    }

    $scope.closeDialog = () => {
        Dialogs.closeWindow({ path: viewData.path });
    };
});